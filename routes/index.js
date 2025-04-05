var express = require('express');
const userSchema = require('../models/userSchema');
var router = express.Router();
const localStrategy = require('passport-local');
const passport = require('passport');
const upload = require('../middleware/multer');

passport.use(new localStrategy(userSchema.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/profile', isLoggedIn, async function(req, res) {
  const user = await userSchema.findOne({username : req.session.passport.user});
  res.render('profile', {user});
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/createpin', function(req, res, next) {
  res.render('createpin');
});


router.post('/uploaddp', isLoggedIn, upload.single('dpimage'), async function(req, res, next) {
  const user = await userSchema.findOne({username : req.session.passport.user});
  user.dp = req.file.filename;
  await user.save();
  res.redirect('/profile');
});


router.post('/createpin', isLoggedIn, upload.single('pinimage'), function(req, res, next) {

  res.send('pin created');
});


// ..........................local strategy...................................
router.post('/register', function(req, res, next) {
  const {fullname,username,email} = req.body;
  const newuser = new userSchema({fullname,username,email});

  userSchema.register(newuser, req.body.password)
  .then(() => {
    passport.authenticate('local')(req, res, () => {
      res.redirect('/profile')
    })
  })
});

router.post('/login', passport.authenticate('local', {
  successRedirect : '/profile',
  failureRedirect : '/login'
}), function(req, res, next) {
});

router.post('/logout', function(req, res, next) {
  req.logout((err) => {
    if(err) return next(err);
    res.redirect('/login');
  })
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated())  return next();
  res.redirect('/login')
}

module.exports = router;
