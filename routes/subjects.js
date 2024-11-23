const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const {authSub} = require('../config/roles')
const {subjects} = require('../data/subjects')
const SpecificPost = require("../models/Post");
router.get('/:sub', ensureAuthenticated, authSub, async(req, res) => {
    if(subjects.includes(req.params.sub)){
        try{
            let posts = await SpecificPost.find();
            const x = posts
            res.render('subject', { user: req.user, data:x, subject:req.params.sub })
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.render('notfound')
    }
});

module.exports = router;
