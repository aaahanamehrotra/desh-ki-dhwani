const express = require("express");
const res = require("express/lib/response");
const {ensureAuthenticated} = require('../config/auth')
const {authMentor, authSub} = require('../config/roles')
const {subjects} = require('../data/subjects')
const router = express.Router();


router.get('/about', (req, res) => res.render('about'));
router.get('/', (req, res) => res.render('dashboard'));
router.get('/profile', ensureAuthenticated, (req, res) => res.render('profile', { user: req.user}));
router.get('/create', ensureAuthenticated, (req, res) => res.render('creategeneral', { username: req.user.name}));
router.get('/updateprofile', ensureAuthenticated, (req, res) => res.render('updateprofile', { user: req.user , subjects:subjects}))
router.get('/accessdenied', (req, res) => res.render('accessdenied'))
router.get('/createcontent', ensureAuthenticated, authMentor, (req, res) => res.render('createcontent', {user: req.user}))
module.exports = router;
