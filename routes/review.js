const express = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");

//Schema validation function
const validateReview = (req,res,next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMessage);
    } else {
        next();
    }
};

//Reviews - Post Route
router.post(
    "/",
     validateReview, 
     wrapAsync(async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
}));

//Reviews - Delete Route
router.delete(
    "/:reviewId", 
    wrapAsync(async (req,res) => {
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    })
); 

module.exports = router;