var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const expressSession = require('express-session');
const passport = require('passport');
const usermodel = require('./models/userSchema');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

var app = express();

mongoose.connect("mongodb://localhost:27017/database")
.then(() => console.log('database connected'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use(expressSession({
  resave : false,
  saveUninitialized : false,
  secret : 'hello hello hello'
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usermodel.serializeUser());
passport.deserializeUser(usermodel.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
