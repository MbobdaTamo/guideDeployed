import nodemailer from 'nodemailer'
import saveImage from './saveImage.js'
const inscription = async(req, res,con) => {
    
    if(req.body.type === "ins1") {
        req.session.user = {}
        req.session.user.name = req.body.nom
        req.session.user.email = req.body.email
        req.session.user.password = req.body.password

        //-------- let's verify if the email is already taken -------------
        let emailExist = await con.awaitQuery(` SELECT * FROM Guide
            WHERE email = ${JSON.stringify(req.session.user.email)}`)
        console.log(emailExist)
        if(emailExist.length > 0) {
            res.send('exist')
            return
        }
        //--------- generating randomly a number -------------------------------
        // generate a number betwen 1000 and 9999
        req.session.code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
        //---------- sending email to the potential new user ----------------------

        let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'leliberateurdumonde@gmail.com',
            pass: 'slyedikshrgspynz'
        }
        })

        let info = await transporter.sendMail({
            from: 'leliberateurdumonde@gmail.com',
            to: req.body.email,
            subject: 'become guide theguide.com',
            //text: 'rext_to_send'
            html: 'Bonjour '+req.body.nom+' ! Votre code pour verifier votre email est: '
            +"<span style='color:red; font-weight:bold'>"+req.session.code+"</span>"
          });
        console.log(info)
        res.send(info)
    }
    else if(req.body.type === "validateEmail") {
        if(req.body.code == req.session.code) res.send('success')
        else res.send('bad number')
    }
    else if (req.body.type === 'ins2') {
        //console.log(req.body)
        //req.session.user = {}// replace by if req.session.user exist else error
        req.session.user.country = req.body.country
        req.session.user.city = req.body.city
        req.session.user.wage = req.body.wage
        req.session.user.quater = req.body.quater
        req.session.user.contact = req.body.contact
        req.session.user.currency = req.body.currency
        req.session.user.typeCompte = req.body.typeCompte
        req.session.user.imgName = 'imgName'+Math.random().toString(36).substring(2, 15)+(new Date).getTime()
        res.send(req.session.user)
    }
    else if (req.body.type === 'ins3') {
        let name = req.session.user.imgName+'id'
        await saveImage(req.files,name,0)
        req.session.user.idRectoImg = name + 0
        req.session.user.idVersoImg = name + 1
        //console.log(names)


        /*req.session.user.name = 'name'
        req.body.password = 'pw'
        req.session.user.email ='email'
        req.session.user.country = 'country'
        req.session.user.city = 'city'
        req.session.user.quater = "quater"
        req.session.user.wage = '30000'
        req.session.user.contact = 78787
        req.session.user.typeCompte = 'type'
        req.session.user.currency = 'currrnecy'
        req.session.user.imgName = 'imgName'*/



        //--------- let's now save all the data in the db ---------------------
        await con.awaitQuery(`INSERT INTO 
            Guide(name, password, email, country, city, quater, wage, contact,type,
                currency,description,imgName,numberOfImg,idRectoImg,idVersoImg)
            VALUES (${JSON.stringify(req.session.user.name)},
            ${JSON.stringify(req.session.user.password)},
            ${JSON.stringify(req.session.user.email)},
            ${JSON.stringify(req.session.user.country)},
            ${JSON.stringify(req.session.user.city )},
            ${JSON.stringify(req.session.user.quater )},
            ${JSON.stringify(req.session.user.wage)},
            ${JSON.stringify(req.session.user.contact)},
            ${JSON.stringify(req.session.user.typeCompte)},
            ${JSON.stringify(req.session.user.currency)},
            ${JSON.stringify('')},
            ${JSON.stringify(req.session.user.imgName)},
            0,
            ${JSON.stringify(req.session.user.idRectoImg)},
            ${JSON.stringify(req.session.user.idVersoImg)}
            )`)
            //------ let's get the id to have all information as the user will be connected now  -----------------
            let userInfos = await con.awaitQuery(`SELECT * FROM Guide
            WHERE email = ${JSON.stringify(req.session.user.email)}
            AND password = ${JSON.stringify(req.session.user.password)}`)
            req.session.user.id = userInfos[0].id
        res.send('done')
    }
}
export default inscription