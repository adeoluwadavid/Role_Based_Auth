const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const path = require('path')
const users = require('./routes/users')
const admin = require('./routes/admin')

const db = "mongodb+srv://netninja:test1234@cluster0.krott.mongodb.net/auth?retryWrites=true&w=majority"

// Initialize the app
const app = express()

// Definiing the PORT
const PORT = process.env.PORT || 5000;

//Defining the middleware
app.use(cors())

//Set the static folder
app.use(express.static(path.join(__dirname,'public')))

//Body Parser midleware
app.use(bodyParser.json())
//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

mongoose.set('useCreateIndex',true)
mongoose.connect(db,{ useNewUrlParser: true,useUnifiedTopology: true  })
.then(result => app.listen(PORT, ()=> console.log(`The server is running at ${PORT}`)))
.catch(err => console.log(err))

app.get('/',(req,res)=>{
    return res.json({
        message: 'This is node.js role based authetication'
    })
})

// Create a custom middleware function
const checkUserType = function(req,res,next){
    const userType = req.originalUrl.split('/')[2]

   //Bring in the passport authetication strategy
    require('./config/passport')(userType , passport)

    next();
}

app.use(checkUserType);
// Bring in the user route
app.use('/api', users)

// Bring in the admin route
app.use('/api/admin',admin)

