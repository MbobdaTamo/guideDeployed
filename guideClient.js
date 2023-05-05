const guideClient = async(req, res,con) => {
    
    if (req.body.type === 'guide') {
        //---decryption-----CAST(UNHEX(HEX(AES_DECRYPT(AES_ENCRYPT(id, 'frankkessie'),'frankkessie'))) AS CHAR(100)) AS id1,
        let guide = await con.awaitQuery(`
        SELECT HEX(AES_ENCRYPT(id, 'frankkessie')) AS id, 
        name, email,
        country,city,quater,wage,contact,type,currency,description,
        imgName,profilImg0,profilImg1,profilImg2,profilImg3,
        numberOfLike,numberOfPlace,numberOfReview,sumOfReview
        FROM Guide
        WHERE id = CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.body.id)}),'frankkessie'))) AS CHAR(100))
        AND deleted = 0`)
        req.session.guideId = guide[0].id
        res.send(guide[0])
    }
    else if(req.body.type === "publications") {
        let places = await con.awaitQuery(`SELECT * FROM Place 
        WHERE guide = CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.body.guide)}),'frankkessie'))) AS CHAR(100))
        AND deleted = 0 ORDER BY id DESC`)
        res.send(places)
    }
    else if (req.body.type === 'guideList') {
        let guides = await con.awaitQuery(`
        SELECT HEX(AES_ENCRYPT(id, 'frankkessie')) AS id, 
        name, email,
        country,city,quater,wage,contact,type,currency,description,
        imgName,profilImg0,profilImg1,profilImg2,profilImg3,
        numberOfLike,numberOfPlace,numberOfReview,sumOfReview
        FROM Guide
        WHERE country = ${JSON.stringify(req.body.country)}
        AND city = ${JSON.stringify(req.body.city)}
        AND deleted = 0`)
        if(guides.length === 0) res.send('none')
        else res.send(guides)
    }
}
export default guideClient