const user = async(req, res,con) => {
    
    if(req.body.type === "inscription") {
        await con.awaitQuery(`INSERT INTO 
        User (name, password, email)
        VALUES (${JSON.stringify(req.body.name)},
            ${JSON.stringify(req.body.password)},
            ${JSON.stringify(req.body.email)})`)
        //------ let's get the id to have all information as the user will be connected now  -----------------
        let userInfos = await con.awaitQuery(`SELECT * FROM User
            WHERE email = ${JSON.stringify(req.body.email)}
            AND password = ${JSON.stringify(req.body.password)}`)
        req.session.userClient = userInfos[0]
        res.send('done')
    }
    else if (req.body.type === 'connexion') {
        let userInfos = await con.awaitQuery(`SELECT * FROM User
            WHERE email = ${JSON.stringify(req.body.email)}
            AND password = ${JSON.stringify(req.body.password)}`)
        if(userInfos.length == 0) {
            res.send('notExist')
            return
        }
        req.session.userClient = userInfos[0]
        res.send(userInfos[0])
    }

    else if (req.body.type === 'like') {
        //--- checking if the review already exist -------
        let review = await con.awaitQuery(`
        SELECT engaged, rate, problem, liked
        FROM UserReview
        WHERE guide = CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.session.guideId)}),'frankkessie'))) AS CHAR(100))
        AND user = ${JSON.stringify(req.session.userClient.id)}`)
        
        let liked = req.body.liked ? 1 : 0

        if(review.length == 0) {
            //---- create review
            await con.awaitQuery(`INSERT INTO 
            UserReview (engaged, problem,liked, user,guide)
            VALUES (0,'',
                ${JSON.stringify(liked)},
                ${JSON.stringify(req.session.userClient.id)},
                CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.session.guideId)}),'frankkessie'))) AS CHAR(100))
                )`)
            res.send('done')
        
            //--- let increase guide numberOfLike
            if(liked === 1) {
                await con.awaitQuery(`UPDATE Guide SET
                numberOfLike = numberOfLike + 1
                WHERE id = CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.session.guideId)}),'frankkessie'))) AS CHAR(100))`)
            }
        }
        else {
            // alter review
            await con.awaitQuery(`UPDATE UserReview SET 
            liked = ${JSON.stringify(liked)}
            WHERE user = ${JSON.stringify(req.session.userClient.id)}
            AND guide = CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.session.guideId)}),'frankkessie'))) AS CHAR(100))
            `)

            //--updating guide numberOfLike --------
            let toAdd = 0
            if(liked === 1 && review[0].liked === 0) toAdd = 1
            if(liked === 0 && review[0].liked === 1) toAdd = -1
            if(toAdd !==0) {
                await con.awaitQuery(`UPDATE Guide SET
                numberOfLike = numberOfLike + (${toAdd})
                WHERE id = CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.session.guideId)}),'frankkessie'))) AS CHAR(100))`)
            }
            res.send('done')
        }
    }
    else if (req.body.type === 'review') {
        //--- checking if the review already exist -------
        let review = await con.awaitQuery(`
        SELECT engaged, rate, problem, liked
        FROM UserReview
        WHERE guide = CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.session.guideId)}),'frankkessie'))) AS CHAR(100))
        AND user = ${JSON.stringify(req.session.userClient.id)}`)
        
        let regex1 = /[0,1,2,3,4,5]/
        let regex2 = /^[0-9]{0,2}.$/

        let engaged = !regex2.test(req.body.engaged) ? 0 : req.body.engaged
        let rate = !regex1.test(req.body.rate) ? 0 : req.body.rate

        if(review.length == 0) {
            //---- create review
            await con.awaitQuery(`INSERT INTO 
            UserReview (engaged, rate, problem, user,guide)
            VALUES (${JSON.stringify(engaged)},
                ${JSON.stringify(rate)},
                ${JSON.stringify(req.body.problem)},
                ${JSON.stringify(req.session.userClient.id)},
                CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.session.guideId)}),'frankkessie'))) AS CHAR(100))
                )`)
        
            //--- let increase guide numberOfReview and update rate
            await con.awaitQuery(`UPDATE Guide SET
            sumOfReview = sumOfReview + ${rate},
            numberOfReview = numberOfReview + 1
            WHERE id = CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.session.guideId)}),'frankkessie'))) AS CHAR(100))`)
        
            res.send({sumOfReviewPlus:rate,numberOfReviewPlus:1}) // those value will be added at the frontend
        }
        else {
            // alter review
            await con.awaitQuery(`UPDATE UserReview SET 
            engaged = ${JSON.stringify(engaged)},
            rate = ${JSON.stringify(rate)},
            problem = ${JSON.stringify(req.body.problem)}
            WHERE user = ${JSON.stringify(req.session.userClient.id)}
            AND guide = CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.session.guideId)}),'frankkessie'))) AS CHAR(100))
            `)

            //---- check if it is the first time this user review
            let toAdd = review[0].rate === -1 ? 1 : 0
            let oldRate = review[0].rate === -1 ? 0 : review[0].rate
            await con.awaitQuery(`UPDATE Guide SET
                sumOfReview = sumOfReview + ${rate-oldRate},
                numberOfReview = numberOfReview + ${toAdd}
                WHERE id = CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.session.guideId)}),'frankkessie'))) AS CHAR(100))`)
            
            res.send({sumOfReviewPlus:rate-oldRate,numberOfReviewPlus:toAdd}) // those value will be added at the frontend
        }
    }
    else if (req.body.type === 'getReview') {
        //--- checking if the review already exist -------
        //console.log('user: '+req.session.userClient.id)
        //console.log('guide: '+req.session.guideId)
        req.session.guideId = req.body.id
        let review = await con.awaitQuery(`
        SELECT engaged, rate, problem, liked
        FROM UserReview
        WHERE guide = CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.session.guideId)}),'frankkessie'))) AS CHAR(100))
        AND user = ${JSON.stringify(req.session.userClient.id)}`)

        if(review.length === 0) res.send('none')
        else res.send(review[0])
    }
}
export default user