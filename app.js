var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
app.use(cookieParser());

//middle ware order matters, we put authentication check here if req does not pass, they will not move on to the rest
function auth(req,res,next)
{
  console.log(req.headers);
  const authHeader = req.headers.authorization
  
  //if no username/pass has been entered yet
  if(!authHeader)
  {
    const err = new Error("You are not authenticated!")
    res.setHeader("WWW-Authenticate", "Basic")
    err.status= 401
    return next(err)
  }

  //Buffer is from node, we don't need to require it, it has a method called .from() that can be used to decode the 
  //username and password from base 64
  const auth = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":")
  
  const user= auth[0]
  const pass= auth[1]

  if (user === "admin" && pass === "password")
  {
    //now the user has be authorized
    return next()
  }
  else
  {
    const err = Error("You are not authenticated!")
    res.setHeader("WWW-Authenticate", "Basic")
    err.status= 401
    return next(err)
  }
}

app.use(auth)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
