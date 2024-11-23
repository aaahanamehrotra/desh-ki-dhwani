module.exports = {
    authSub: function(req, res, next) {
    if (req.user.subjects.includes(req.params.sub)) {
      return next();
    }
  res.redirect('/accessdenied')
  },
    authMentor: function(req, res, next) {
      if (req.user.role === "mentor") {
        return next();
      }
      res.redirect('/accessdenied')
    }
    
};