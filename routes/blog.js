const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");


router.post('/create', async(req, res) => {
    const { username, title, article } = req.body;
    let errors = []
    if(!title || !article){
        errors.push({ msg: 'Please fill in all fields'});
    }
    if(errors.length > 0){
        res.render('creategeneral', {
            errors,
            username,
            title,
            article
        });
    }else{
        Post.findOne({ title:title })
        .then(oldpost => {
            if(oldpost){
                errors.push({ msg: 'A post with this title already exists' })
                res.render('creategeneral', {
                    errors,
                    username,
                    title,
                    article
            });
            }else{
                const newPost = new Post({...req.body, subject:"general"})
                try{
                    const savedPost = newPost.save().then( post =>
                    res.render("singlepost", {data: post}))
                }catch(err){
                    res.status(500).json(err)
            }
        }
    });
}
});

router.get("/", async(req, res)=>{
    try{
        let posts = await Post.find({subject:"general"});
        const x = posts
        res.render("general", {data: x})
    }catch(err){
        res.status(500).json(err);
    }
})

router.get("/:id", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        const x = post
        console.log(x)
        res.render("singlepost", { data: post})
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;