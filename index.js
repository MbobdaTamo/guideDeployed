import mysql from 'mysql-await'
import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import history from 'connect-history-api-fallback'
/*import axios from'axios'
import fs from 'fs'*/
//---- codes snippets ---------------
import inscription from './inscription.js'
import connexion from './connexion.js'
import publication from './publication.js'
import guide from './guide.js'
import guideClient from './guideClient.js'
import user from './user.js'

// connect to mysql db
let con = mysql.createConnection({
    host: "34.89.134.196",
    user: "root",
    password: "Dembele2000*",
    database: "guide"
})
//---------- express setting up --------------

const app = express()

app.use(history({
    rewrites: [
      {
        from: /^\/images\/.*$/,
        to: function(context) {
            return context.parsedUrl.path
        }
      }
    ]
 }))

app.use(cookieParser());
app.use(session({
    secret: "my fuckinggg secret sentences",
    resave: false,
    saveUninitialized: true,
    cookie: { secure:false, httpOnly:false,sameSite:'Lax',maxAge: 1000*60*10 }
}))
let allowedDomains = []
let origine = ''
let cors1 = {origin:function(origin,callback){
    console.log('bonjour'+origin)
    origine = origin
    if(allowedDomains.indexOf(origin) == -1) allowedDomains.push(origin)
    return callback(null,true)
},methods:["POST","OPTIONS"],credentials:true}
app.use(cors(cors1/*{methods:["POST","OPTIONS"],origin:"http://localhost:8080",credentials:true}*/))

const port = 3000

// body parser to retrieve informations
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//--
app.use(    
    fileUpload({
        limits: {
            fileSize: 10000000, // Around 10MB
        },
        abortOnLimit: true,
    })
)
app.use(express.static('public'))

app.set('trust proxy', true)
app.post('/inscription.php', (req, res) => {
    inscription(req,res,con)
})
app.post('/connexion.php', (req, res) => {
    connexion(req,res,con)
})
app.post('/publication.php', (req, res) => {
    publication(req,res,con)
})
app.post('/guide.php', (req, res) => {
    guide(req,res,con)
})
app.post('/guideClient.php', (req, res) => {
    guideClient(req,res,con)
})
app.post('/user.php', (req, res) => {
    user(req,res,con)
})
app.get('/', (req, res) => {
    res.send('bonjour Gonzalo Lira')
})
app.post('/inscription1.php', async(req, res) => {
    //res.send('0') // no news
    //req.session.name = name
    /*axios.defaults.headers = {
        "Accept": "application/json",
        "api-token": "6MAotNCnftCXBk1Nwce8gRTbDGRiTRPKFG7JM9AXdRkgdJRbPGso4wxc5K3a2easqwE",
        "user-email": "estadiotamo@gmail.com"
    }

    let result = await axios.get('https://www.universal-tutorial.com/api/getaccesstoken')
    console.log(result.data.auth_token)*/

    /*axios.defaults.headers = {
        "Accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJlc3RhZGlvdGFtb0BnbWFpbC5jb20iLCJhcGlfdG9rZW4iOiI2TUFvdE5DbmZ0Q1hCazFOd2NlOGdSVGJER1JpVFJQS0ZHN0pNOUFYZFJrZ2RKUmJQR3NvNHd4YzVLM2EyZWFzcXdFIn0sImV4cCI6MTY3NDg5NzIwM30.o3RNJ0NRyZSJeEeY2vUkRwlGsIeck6z72bI7IikY74A"
    }

    let result = await axios.get('https://www.universal-tutorial.com/api/countries/')
    let result = await axios.get('https://www.universal-tutorial.com/api/states/Cameroon')
    let result = await axios.get('https://www.universal-tutorial.com/api/cities/Centre')*/

    // get all states 
    
    /*function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    }

    let result
    let datas = JSON.parse(fs.readFileSync('public/datas.json'))
    let i = 0, j = 0
    //7,161
    console.log(datas.length)
    for(i=161; i<162; i++) {
        console.log(i+" "+datas[i].country_name)
        //if(i==161) continue;
        j=0
        for(j=3; j<datas[i].states.length; j++){
            result = await axios.get('https://www.universal-tutorial.com/api/cities/'+datas[i].states[j].state_name)
            datas[i].states[j] = {...datas[i].states[j],cities:result.data}
            //fs.writeFileSync('public/datasTest.json',JSON.stringify(datas))
            //console.log(result.data)
            if(j==0) continue;
            console.log(i+"  max: "+datas[i].states.length+" now:"+j)
        }
    }
    fs.writeFileSync('public/datas.json',JSON.stringify(datas))
    console.log(datas[36])
    res.send(datas[36])*/

    res.send('')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
