const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");

//Schema validation function
const validateListing = (req,res,next) => {
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMessage);
    } else {
        next();
    }
};


// Index Route - Show all listings
router.get("/", wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New Route 
router.get("/new", isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
});

// Show Route - Show details of one listing
router.get(
    "/:id", 
    wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// Create Route 
router.post(
    "/",
    isLoggedIn,
    validateListing, //using validation- passed as a middleware
    wrapAsync(async (req,res,next) => {
        // let result = listingSchema.validate(req.body);
        // console.log(result);
        // if (result.error) {
        //     return next(new ExpressError(400, result.error.message));
        // }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    }
));

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req,res,next)=> {
    let {id} = req.params;
    // id = id.trim();
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return next(new ExpressError(400, 'Invalid listing ID'));
    // }
    const listing = await Listing.findById(id);
    // if (!listing) {
    //     return next(new ExpressError(404, 'Listing not found'));
    // }
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//Update Route
router.put("/:id", 
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res)=> {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id",
    isLoggedIn,
    wrapAsync(async (req,res) => {
    let {id} = req.params;
    id = id.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid listing ID');
    }
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));




module.exports = router;