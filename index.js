const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const app=express() 

const personneModel= require('./models/personne')
const postModel=require('./models/post')
const categorieModel=require('./models/categorie')
const commentaireModel=require('./models/commentaire')

const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json())
app.use(cors( {
   origin:["http://localhost:5173"],
   methods: ["GET","POST"],
   credentials : true
}
))


mongoose
.connect(
   "mongodb+srv://ELKHALDI-Nada:DH0ST0WMj1VhHKeW@forum-db.ygxqjnk.mongodb.net/?retryWrites=true&w=majority"
)
 

app.post('/register', (req,res) => {
    const{nom,prenom,age,email,password,telephone,pays}=req.body;
    bcrypt.hash(password,10)
    .then(hash => {
        personneModel.create({nom,prenom,age,email,telephone,pays,password: hash})
        .then(users => res.json(users))
        .catch(err => res.json(err))
    }).catch(err => console.log(err.message))
   
})

app.post("/login",(req,res) => {
    const {email,password} =req.body;
    personneModel.findOne({email: email})
    .then(user =>{
        if(user){
            bcrypt.compare(password, user.password, (err, result) => {
                if(result){
                    const token=jwt.sign({email: user.email}, "jwt-secret-key", {expiresIn:"1d"})
                    res.cookie("token", token);
                    res.json("success");
                }
                else{
                    res.json("the password is incorrect")
                }
            })
        }
        else {
            res.json("Not exist")
        }
    })
})

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json('Logged out successfully');
  });



const verifyUser= (req, res, next) =>{
    const token= req.cookies.token;
    console.log(token);
    if(!token){
        return res.json("Token not available")
    } else{
        jwt.verify(token,"jwt-secret-key",(err,decoded)=> {
            if(err) {return res.json("token is wrong")}
            next();
        })
    }
}
app.get('/home',verifyUser, (req,res) => { 
    return res.json("success")
}) 

app.listen(3000, () => {
    console.log(`runnig`);
  });
