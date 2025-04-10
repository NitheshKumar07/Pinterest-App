var express = require('express');
const userSchema = require('../models/userSchema');
var router = express.Router();
const localStrategy = require('passport-local');
const passport = require('passport');
const {uploaddp, uploadpin} = require('../middleware/multer')
const pinSchema = require('../models/pinSchema');

passport.use(new localStrategy(userSchema.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/feed', async function(req, res) {
  const pins = await pinSchema.find().populate('user');
  res.render('feed', {pins});
});

router.get('/feed/:title?/:id', async function(req, res) {
 try{
  const query = {_id : req.params.id};
  if(req.params.title){
    query.pintitle = req.params.title;
  }

  const pin = await pinSchema.findOne(query).populate('user');

  const findingtags = pin.tags.map( tag => tag.toLowerCase());

  const pintags = await pinSchema.find({
    tags : {$in : findingtags},
    _id : {$ne : pin._id}
  }).populate('user');

  pintags.sort((a,b) => {
    const apin = a.tags.filter(atag => findingtags.includes(atag)).length;
    const bpin = b.tags.filter(btag =>  findingtags.includes(btag)).length;
    return bpin-apin;
  })
  res.render('solofeed', {pin, pintags});
} 
  catch (err) {
    res.status(500).json({error : err});
  }
});


router.get('/profile', isLoggedIn, async function(req, res) {
  const user = await userSchema.findOne({username : req.session.passport.user});
  await user.populate('pins');
  res.render('profile', {user});
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/createpin', isLoggedIn, function(req, res, next) {
  res.render('createpin');
});


router.post('/uploaddp', isLoggedIn, uploaddp.single('dpimage'), async function(req, res, next) {
  const user = await userSchema.findOne({username : req.session.passport.user});
  user.dp = req.file.path;
  await user.save();
  res.redirect('/profile');
});


router.post('/createpin', isLoggedIn, uploadpin.single('pinimage'), async function(req, res, next) {
  const user = await userSchema.findOne({username : req.session.passport.user});
  const newpin = await pinSchema.create({
    pinimage: req.file.path,
    pintitle: req.body.pintitle,
    pindescription: req.body.pindescription,
    user: user._id,
    tags : req.body.tags.split(','),
    link: req.body.link,
  })
  user.pins.push(newpin._id);
  await user.save();
  res.redirect('/feed');
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
