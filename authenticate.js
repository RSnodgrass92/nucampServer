const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User= require("./models/user")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const jwt=require("jsonwebtoken") 

const config = require("./config.js")

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//get token is a function that receives a user object which contains an id for a user document
exports.getToken = user =>{
   
    //return a jwt token from the jasonwebtoken api, the 3600 is in seconds not in milliseconds, if no argument is provided, it will last forever but this is not recommended
    return jwt.sign(user, config.secretKey, {expiresIn: 3600})
}

const opts ={}

//this determines how the server expects a jwt token to be sent as there are several options. This option specifically says to request the token in an authorization header and as a bearer token this is the simplest method for sending a jwt
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

//this option lets us supply the jwt strategy with the key with which we will assign this token
opts.secretOrKey = config.secretKey


//* JWT strategy for passport
exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        // the done callback function is written in the passport-jwt module
        (jwt_payload, done) => 
        {
            console.log("JWT payload", jwt_payload);
            User.findOne({_id: jwt_payload._id},(err,user)=>{
              
                if(err)
                {
                    return done(err, false)
                }

                else if(user)
                {
                    return done(null,user)
                }

                else
                {
                    return done(null,false)
                }
            })
        }
    )
)

//use this to make sure that an incoming request is coming from a authenticated user this is set up as a shortcut
exports.verifyUser = passport.authenticate("jwt",{session: false})

exports.verifyAdmin = () => {
   
    if(req.user.admin)
    {
        return next()
    }
    else
    {
        res.status= 403
        const err = new Error(`You are not authorized to perform this operation!`)
        return next(err)
    }
}