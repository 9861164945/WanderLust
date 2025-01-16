const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema,reviewSchema} = require("./schema");

module.exports.isLoggedIn=(req,res,next)=>{
  console.log(req.user);
    if(!req.isAuthenticated()){
      
      req.session.redirectUrl=req.originalUrl;
        req.flash("Error","You must be logged in to Create listing!");
        return res.redirect("/login");
      }
      next(); //process if valid 
       
};
//MiddleWare for a validate user who is permissio to edit and delete the listing

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;

  let listing;
  try {
    listing = await Listing.findById(id);
  } catch (err) {
    req.flash("error", "Invalid listing ID.");
    return res.redirect("/listings");
  }

  // Check if listing exists
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  const currUser = req.user;

  // Check if the current user is the owner
  if (!listing.owner || !listing.owner.equals(currUser._id)) {
    req.flash("error", "You do not have permission to access this listing.");
    return res.redirect(`/listings/${id}`);
  }

  // Proceed to the next middleware or route handler
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
  const { rating, comment } = reviewSchema.validate(req.body.review);
  if (!rating || !comment) 
    {
      req.flash("error", "Please provide both a rating and a comment.");
      return res.redirect(`/listings/${req.params.id}`);
    }
  next(); // Proceed if valid
};
