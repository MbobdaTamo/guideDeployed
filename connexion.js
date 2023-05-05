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
}
export default inscription