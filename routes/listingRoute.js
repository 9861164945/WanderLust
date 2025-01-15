const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema} = require("../scema.js");
const Listing = require("../models/listing.js");
const{isLoggedIn,isOwner,validateListing}=require("../middleware.js");


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
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log("New listing saved:", newListing);
  } catch (error) {
    console.error("Error saving listing:", error.message);
    throw new ExpressError(500, "Error saving listing");
  }
  
  res.redirect("/listings");  // Changed from /listings to /listing
}));

// Edit Route
router.get("/:id/edit",isOwner, wrapAsync(async (req, res) => 
  {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("succcess","Listing Edited");
  //alert("Listing Edited Succesfully");
  res.render("listings/edit.ejs", { listing });
}
));

// Update Route
router.put("/:id", isOwner,validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("succcess","Listing Updated");
  //alert("Listing Uodated Succesfully");
  res.redirect(`/listings/${id}`);  // Changed from /listings/${id} to /listing/${id}
}));

// Delete Route
router.delete("/:id",isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("succcess","Listing Deleted");
  //alert("Listing deleted Succesfullt");
  res.redirect("/listings");  // Changed from /listings to /listing
}));

module.exports = router;
