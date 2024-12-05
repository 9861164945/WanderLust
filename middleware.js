module.exports.isLoggedIn=(req,res,next)=>{
  console.log(req.user);
    if(!req.isAuthenticated()){
      
      req.session.redirectUrl=req.originalUrl;
        req.flash("Error","You must be logged in to Create listing!");
        return res.redirect("/login");
      }
      next();  
       
}