require('dotenv').config()
const mongoose = require('mongoose')
const express = require("express");
const app = express();
const bodyParser= require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const userModel = require('./model/userModel')
const port = process.env.PORT || 7000;
const mongourl= process.env.MONGO ;

app.listen(port, () => {
    console.log('Server is running at :'+ port);
  });
 app.set('view engine', 'ejs');
app.set('views','./views')
app.use(express.static('public'))
 app.get("/" ,function(req,res)
 {
     res.send("Api is Working");
 })
 app.get("/signup",function(req,res)
 {
    res.send("Sign Up Page")
 })
 app.post("/signup", async function(req,res)
 {
    const singleuser=new userModel(
        {
          displayName:req.body.name,
          email:req.body.email,
          password:req.body.password
        });
       try
       {
            const usr = await singleuser.save()
            console.log(usr)
            res.json(usr);
       }
       catch(error)
       {
        console.log(error.message)
       }
 })
 app.post("/login", async function(req,res)
 {
    const mail = req.body.email
    const pass = req.body.password
    try
    {
        const existuser = await userModel.findOne({email:mail})
        if(existuser)
        {
            const loggedin= 
            {
                message:"LoggedIn"
            }
            if(pass==existuser.password)
            {
                res.json(loggedin)
            }
            else
            {
                const wrongpass =
                {
                    message:"Wrong Password"
                }
                res.json(wrongpass)

            }
        }
        else
        {
           const invalid=
           {
            message:"Invalid credentials"
           }
           res.json(invalid)
        }
    }
    catch(error)
    {
        console.log(error.message)
    }
 })
 //Database Connection
 mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", (error) => console.log(error));
  db.once("open", () => console.log("Database Connected"));
app.use('/assets',express.static('assets'));

app.use("/public/images",express.static('./public/images'));
