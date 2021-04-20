var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session")
//calls the require function which returns a function, which is then passed the session argument and run
const FileStore= require("session-file-store")(session)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require("./routes/campsiteRouter")
const promotionRouter = require("./routes/promotionRouter")
const partnersRouter = require("./routes/partnersRouter")

//*connect to the mongo db server
const mongoose= require("mongoose")

const url = "mongodb://localhost:27017/nucampsite"
const connect = mongoose.connect(url,{
  useCreateIndex: true, 
  useFindAndModify: false, 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})


connect.then(()=>console.log("Connected correctly to server"), err => console.log(err))
//*

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//pass in a secret key here, it could be any string
//app.use(cookieParser("secretkey")); Express session offers its own implementation of cookies.
//using both can cause conflicts so we will not use cookieParser
app.use(session(
  {
    name: "session-id", 
    secret: "secretkey", 
    //saveUnintialized when a new session is created but no updates are made to it, at the end of the req it wont get saved. No cookie is sent to the client, this is to prevent having a bunch of empty session files and cookies from being set up. 
    saveUninitialized: false, 
    resave: false, 
    //save to hard disk not just running application memory
    store: new FileStore()
  }
))

app.use('/', indexRouter);
app.use('/users', usersRouter);

//middle ware order matters, we put authentication check here if req does not pass, they will not move on to the rest
function auth(req,res,next)
{
  //the session middleware will add a prop called session to the request object 
  console.log(req.session);

  //the singedCookies prop is provided by the cookie parser middleware
  if(!req.session.user)
  {
        const err = new Error("You are not authenticated!")
        err.status= 401
        return next(err)
  }

  else
  {
    if(req.session.user === "authenticated")
    {
      return next()
    }
    else
    {
      const err = new Error("You are not authenticated!")
        err.status= 401
        return next(err)
    }
  }
}

app.use(auth)
app.use(express.static(path.join(__dirname, 'public')));

app.use("/campsites", campsiteRouter)
app.use("/promotions", promotionRouter)
app.use("/partners", partnersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
