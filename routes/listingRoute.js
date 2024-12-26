const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../scema.js");
const Listing = require("../models/listing.js");
const{isLoggedIn}=require("../middleware.js");
// Validation
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route
router.get("/", isLoggedIn ,async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// New Route
router.get("/new",isLoggedIn, (req, res) => {
  // alert("New Listing Added Succesfully");
 res.render("listings/new.ejs");
});

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  

  res.render("listings/show.ejs", { listing });
  console.log(listing);
}));

// Create Route
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res, next) =>
   {
  let result = listingSchema.validate(req.body);
  if (result.error) 
    {
    throw new ExpressError(400, result.error);
  }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("succcess","New Listing Created");
  res.redirect("/listings");  // Changed from /listings to /listing
}));

// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => 
  {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("succcess","Listing Edited");
  //alert("Listing Edited Succesfully");
  res.render("listings/edit.ejs", { listing });
}
));

// Update Route
router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("succcess","Listing Updated");
  //alert("Listing Uodated Succesfully");
  res.redirect(`/listings/${id}`);  // Changed from /listings/${id} to /listing/${id}
}));

// Delete Route
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("succcess","Listing Deleted");
  //alert("Listing deleted Succesfullt");
  res.redirect("/listings");  // Changed from /listings to /listing
}));

module.exports = router;
