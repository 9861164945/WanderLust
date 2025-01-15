const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn=(req,res,next)=>{
  console.log(req.user);
    if(!req.isAuthenticated()){
      
      req.session.redirectUrl=req.originalUrl;
        req.flash("Error","You must be logged in to Create listing!");
        return res.redirect("/login");
      }
      next();  
       
};
//MiddleWare for a validate user who is permissio to edit and delete the listing
module.exports.isOwner=async(req,res,next)=>{
let{id}=req.params;
let listing=await Listing.findById(id);
if(!listing.owner.equals(currUser._id))
{
req.flash("Error","You do not have the permission  Because this listing not created by You");
res.redirect(`/listings/${id}`); 
}
next();
};
//MiddleWare For Validation
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();//process If valid
  }
};

//Middleware for Review Validation
module.exports.validateReview = (req, res, next) => {
  const { rating, comment } = req.body.review;
  if (!rating || !comment) {
      req.flash("error", "Please provide both a rating and a comment.");
      return res.redirect(`/listings/${req.params.id}`);
  }
  next(); // Proceed if valid
};
