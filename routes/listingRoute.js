const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema} = require("../schema.js");
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
router.get("/:id",isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  

  res.render("listings/show.ejs", { listing });
  console.log(listing);
}));

// Create Route
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res, next) =>
   {
  let result = listingSchema.validate(req.body);
  console.log(req.body);
  if (result.error) 
    {
    throw new ExpressError(400, result.error);
  }
  try {
    req.body.listing.price = Number(req.body.listing.price);
    const newListing = new Listing(req.body.listing);
   newListing.save();
    console.log("New listing saved:", newListing);
  } catch (error) {
    console.error("Error saving listing:", error.message);
    throw new ExpressError(500, "Error saving listing");
  }
  
  res.redirect("/listings");  // Changed from /listings to /listing
}));
// Edit Route
router.get("/:id/edit", isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
}));

// Update Route
router.put("/:id", isOwner, validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;

  // Update the listing
  const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Check if the listing was updated
  if (!updatedListing) {
    req.flash("error", "Listing update failed.");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing updated successfully.");
  res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;

  // Delete the listing
  const deletedListing = await Listing.findByIdAndDelete(id);

  // Check if the listing was deleted
  if (!deletedListing) {
    req.flash("error", "Failed to delete listing.");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing deleted successfully.");
  res.redirect("/listings");
}));
module.exports = router;
