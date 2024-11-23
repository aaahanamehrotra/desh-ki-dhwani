const express = require('express');
const router = express.Router();
const SpecificPost = require("../models/Post");

router.post('/', async(req, res) => {
    const { username, title, article, subject } = req.body;
    let errors = []
    if(!title || !article || subject === ""){
        errors.push({ msg: 'Please fill in all fields'});
    }
    if(errors.length > 0){
        res.render('createcontent', {
            user:req.user,
            errors,
            title,
            article,
            subject
        });
    }else{
        SpecificPost.findOne({ title:title })
        .then(oldpost => {
            if(oldpost){
                errors.push({ msg: 'A post with this title already exists' })
                res.render('createcontent', {
                    errors,
                    username,
                    title,
                    article,
                    subject
            });
            }else{
                const newPost = new SpecificPost(req.body)
                try{
                    const savedPost = newPost.save().then( post =>
                        res.render("singlesubpost", {data: post, subject:subject}))
                    // res.render(`${subject}`, {user:res.user}))
                }catch(err){
                    res.status(500).json(err)
            }
        }
    });
}
});

router.get("/:id", async(req, res)=>{
    try{
        const post = await SpecificPost.findById(req.params.id);
        const x = post
        res.render("singlesubpost", { data: post})
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;