
import nodemailer from 'nodemailer'

const inscription = async(req, res,con) => {
    
    if(req.body.type === "guide") {
        let userInfos = await con.awaitQuery(`SELECT * FROM Guide
            WHERE email = ${JSON.stringify(req.body.email)}
            AND password = ${JSON.stringify(req.body.password)}`)
        if(userInfos.length == 0) {
            res.send('notExist')
            return
        }
        req.session.user = userInfos[0]
        res.send('found')
    }
    else if(req.body.type === "recoverAccount1") {
        req.session.recoverEmail = req.body.email
        req.session.recoverPassword = req.body.password

        //-------- let's verify if the email is already taken -------------
        let emailExist = await con.awaitQuery(` SELECT * FROM Guide
            WHERE email = ${JSON.stringify(req.body.email)}`)
        console.log(emailExist)
        if(emailExist.length == 0) {
            res.send('noExist')
            return
        }
        req.session.recoverId = emailExist[0].id
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
            subject: 'Récupérer votre compte guide',
            //text: 'rext_to_send'
            html: 'Bonjour ! Votre code pour verifier votre email et récupérer votre compte est: '
            +"<span style='color:red; font-weight:bold'>"+req.session.code+"</span>"
          });
        console.log(info)
        res.send(info)
    }
    else if (req.body.type === 'recoverAccount2') {
        // lets verify the code at first
        if(req.body.code != req.session.code) {
            res.send('bad number')
            return
        }
        // let change the password
        
        await con.awaitQuery(`UPDATE Guide SET 
        password = ${JSON.stringify(req.session.recoverPassword)}
        WHERE id = ${JSON.stringify(req.session.recoverId)}`)
        res.send('success')
    }
}
export default inscription