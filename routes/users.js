const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
// Load Subjects
const {subjects} = require('../data/subjects')
// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register', {subjects:subjects, selectedsubjects:new Array()}));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2, role, ...selectedsubjects } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if(Object.keys(selectedsubjects).length < 1){
    errors.push({ msg: 'Select Atleast 1 subject' });
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      subjects:subjects,
      selectedsubjects:Object.keys(selectedsubjects)
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
          subjects,
          selectedsubjects:Object.keys(selectedsubjects)
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          subjects:Object.keys(selectedsubjects),
          role
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

router.post('/updprofile', async(req,res) => {
  const { name, email, role, ...selectedsubjects } = req.body;
  let errors = []
  if(!name){
      errors.push('Please enter your name')
  }
  if(Object.keys(selectedsubjects).length < 1){
    errors.push({ msg: 'Select Atleast 1 subject' });
  }
  if(errors.length > 0){
      res.render('updateprofile', {
          user: req.user,
          errors,
          name,
          email,
          subjects,
          selectedsubjects:Object.keys(selectedsubjects)
      })}
  else{
      const updated = await User.updateOne(  {email: req.body.email} , { $set: { name:name, subjects:Object.keys(selectedsubjects), role: role } })
      res.redirect('/profile')
  }
      
  
})


module.exports = router;