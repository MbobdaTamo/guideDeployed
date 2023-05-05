import saveImage from './saveImage.js'

const publication = async(req, res,con) => {
    if(req.body.aim === "saveInfos") {

        // verification
        let regexType = /[0,1,2]/
        let regex1 = /[1,2,3,4,5]/
        let regex2 = /^[0-9]{0,2}.$/
        let regexPrix = /^[0-9]{0,10}.$/
        let type = !regexType.test(req.body.type) ? 0 : req.body.type
        let rate = !regex1.test(req.body.rate) ? 1 : req.body.rate
        let environment = !regex1.test(req.body.environment) ? 1 : req.body.environment
        let accessibility = !regex1.test(req.body.accessibility) ? 1 : req.body.accessibility
        let numberOfRoom = !regex2.test(req.body.numberOfRoom) ? 1 : req.body.numberOfRoom
        let monthlyPrice = !regexPrix.test(req.body.monthlyPrice) ? 0 : req.body.monthlyPrice
        let dailyPrice = !regexPrix.test(req.body.dailyPrice) ? 0 : req.body.dailyPrice
        let hourlyPrice = !regexPrix.test(req.body.hourlyPrice) ? 0 : req.body.hourlyPrice
        let price = !regexPrix.test(req.body.price) ? 0 : req.body.price
        let superficies = !regexPrix.test(req.body.superficies) ? 0 : req.body.superficies
        let veranda = req.body.veranda == 1 ? 1 : 0
        let garden = req.body.garden == 1 ? 1 : 0

        // case : it is a new publication
        if(req.body.id == -1) {
            // defining imgName
            let imgName = 'imgNamePub'+Math.random().toString(36).substring(2, 15)+(new Date).getTime()
            //--------- let's now save all the data in the db ---------------------
            

            await con.awaitQuery(`INSERT INTO 
            Place(type, rate, environment, accessibility, numberOfRoom,
                price, toiletType, bathRoomType, position, veranda, garden,
                monthlyPrice, dailyPrice, hourlyPrice,superficies,
                description,imgName,guide,img0,img1,img2,img3)
            VALUES (${JSON.stringify(type)},
                ${JSON.stringify(rate)},
                ${JSON.stringify(environment)},
                ${JSON.stringify(accessibility)},
                ${JSON.stringify(numberOfRoom)},
                ${JSON.stringify(price)},
                ${JSON.stringify(req.body.toiletType)},
                ${JSON.stringify(req.body.bathRoomType)},
                ${JSON.stringify(req.body.position)},
                ${JSON.stringify(veranda)},
                ${JSON.stringify(garden)},
                ${JSON.stringify(monthlyPrice)},
                ${JSON.stringify(dailyPrice)},
                ${JSON.stringify(hourlyPrice)},
                ${JSON.stringify(superficies)},
                ${JSON.stringify(req.body.description)},
                ${JSON.stringify(imgName)},
                ${JSON.stringify(req.session.user.id)},'','','',''
                )`)
                
                //--- increasing numberOfPlace in guide ------
                await con.awaitQuery(`UPDATE Guide SET
                numberOfPlace = numberOfPlace + 1
                WHERE id = ${JSON.stringify(req.session.user.id)}`)

                //------ let's get the id to have all information as the user will be connected now  -----------------
                let infos = await con.awaitQuery(`SELECT id FROM Place
                    WHERE imgName = ${JSON.stringify(imgName)}`)
                res.send({id:infos[0].id,imgName:imgName})
        }
        else {
            //---- let's update the data as the Place already saved once
            
            await con.awaitQuery(`UPDATE Place SET 
                type = ${JSON.stringify(type)},
                rate = ${JSON.stringify(rate)}, 
                environment = ${JSON.stringify(environment)},
                accessibility = ${JSON.stringify(accessibility)},
                numberOfRoom = ${JSON.stringify(numberOfRoom)},
                price = ${JSON.stringify(price)},
                toiletType = ${JSON.stringify(req.body.toiletType)},
                bathRoomType = ${JSON.stringify(req.body.bathRoomType)},
                position = ${JSON.stringify(req.body.position)},
                veranda = ${JSON.stringify(veranda)},
                garden = ${JSON.stringify(garden)},
                monthlyPrice = ${JSON.stringify(monthlyPrice)},
                dailyPrice = ${JSON.stringify(dailyPrice)},
                hourlyPrice = ${JSON.stringify(hourlyPrice)},
                superficies = ${JSON.stringify(superficies)},
                description = ${JSON.stringify(req.body.description)}
                WHERE id = ${JSON.stringify(req.body.id)} 
                AND guide = ${JSON.stringify(req.session.user.id)}`)
            
            res.send('done')    
        }
    }
    if(req.body.aim === "saveImg") {
        //----- saving of img and getting img indexes sent ----------
        let imgIndex = []
        for(const index in req.files) {
            let i = index[index.length-1]
            imgIndex.push(i)
            let file = {}
            file['image'+i] = req.files[index]
            let c = await saveImage(file,req.body.imgName,index[index.length-1])
            console.log("les noms des im: "+i)
        }
        console.log(imgIndex)
        //-------- let's save in the db ---------------------------
        let i = 0
        for(i=0;i<imgIndex.length;i++){
            await con.awaitQuery(`UPDATE Place SET 
            img${imgIndex[i]} = ${JSON.stringify(req.body.imgName+imgIndex[i])}
            WHERE id = ${JSON.stringify(req.body.id)}
            AND guide = ${JSON.stringify(req.session.user.id)}`)
        }
        //----------- getting deleted images ---------------------------
        let imgIndexDel = []
        for(const index in req.body) {
            if(req.body[index] === 'toDelete' ) {
                console.log('the stuffs to be deleted: '+index[index.length-1])
                imgIndexDel.push(index[index.length-1])
            }
        }
        //-------- let's save in the db ---------------------------
        for(i=0;i<imgIndexDel.length;i++){
            await con.awaitQuery(`UPDATE Place SET 
            img${imgIndexDel[i]} = ''
            WHERE id = ${JSON.stringify(req.body.id)}
            AND guide = ${JSON.stringify(req.session.user.id)}`)
        }
        res.send('done')
    }

    if(req.body.aim === "getPub") {
        let places = await con.awaitQuery(`SELECT * FROM Place 
        WHERE guide = ${JSON.stringify(req.session.user.id)} 
        AND deleted = 0 ORDER BY id DESC`)
        res.send(places)
    }
    if(req.body.aim === "delete") {
        await con.awaitQuery(`UPDATE Place SET
            deleted = 1
            WHERE id = ${JSON.stringify(req.body.id)}
            AND guide = ${JSON.stringify(req.session.user.id)}`)
        
        //--- decreasing numberOfPlace in guide ------
        await con.awaitQuery(`UPDATE Guide SET
            numberOfPlace = numberOfPlace - 1
            WHERE id = ${JSON.stringify(req.session.user.id)}`)

        res.send('done')
    }
}
export default publication  