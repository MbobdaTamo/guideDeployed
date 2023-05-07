import saveImage from './saveImage.js'
const inscription = async(req, res,con) => {
    if((typeof req.session.user === 'undefined') || (req.session.user === null)) {
        res.send('error')
        return
    }
    
    if (req.body.type === 'get') {
        //---decryption-----CAST(UNHEX(HEX(AES_DECRYPT(AES_ENCRYPT(id, 'frankkessie'),'frankkessie'))) AS CHAR(100)) AS id1,
        
        let guide = await con.awaitQuery(`
        SELECT HEX(AES_ENCRYPT(id, 'frankkessie')) AS id,
        name, email,
        country,city,quater,wage,contact,type,currency,description,
        imgName,profilImg0,profilImg1,profilImg2,profilImg3
        FROM Guide
        WHERE id = ${JSON.stringify(req.session.user.id)} AND deleted = 0`)
        
        res.send(guide[0])
    }
    else if (req.body.type === 'saveImg') {
        // verification
        let regex = /[0,1,2,3]/
        if(!regex.test(req.body.index)) {
            console.log('error')
            res.send('error')
            return
        }
        console.log('there we are')
        let name = req.session.user.imgName+'profil'
        await saveImage(req.files,name,req.body.index)
        //---- saving changes in the db -----
        await con.awaitQuery(`UPDATE Guide SET 
        profilImg${req.body.index} = ${JSON.stringify(name+req.body.index)}
        WHERE id = ${JSON.stringify(req.session.user.id)}`)
        res.send('done')
    }
    else if (req.body.type === 'deleteImg') {
        // verification
        let regex = /[0,1,2,3]/
        if(!regex.test(req.body.index)) {
            res.send('error')
            return
        }

        await con.awaitQuery(`UPDATE Guide SET 
        profilImg${req.body.index} = ''
        WHERE id = ${JSON.stringify(req.session.user.id)}`)
        res.send('done')
    }
    else if (req.body.type === 'saveInfos') {
        let regex = /^[0-9]{0,8}.$/
        let cur = ['FCFA','USD','EURO','INR']
        if(!regex.test(req.body.wage) || !regex.test(req.body.contact) || cur.indexOf(req.body.currency) == -1) {
            res.send('error')
            return
        }

        await con.awaitQuery(`UPDATE Guide SET 
        description = ${JSON.stringify(req.body.description)},
        wage = ${JSON.stringify(req.body.wage)},
        quater = ${JSON.stringify(req.body.quater)},
        contact = ${JSON.stringify(req.body.contact)},
        currency = ${JSON.stringify(req.body.currency)}
        WHERE id = ${JSON.stringify(req.session.user.id)}`)
        res.send('done')
    }
}
export default inscription