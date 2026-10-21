const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router
    .route("/")
    // Index Route - Show all listings
    .get( wrapAsync(listingController.index)) 
    .post( 
    // Create Route
        isLoggedIn,
        validateListing, //using validation- passed as a middleware
        wrapAsync(listingController.createListing)
    );

// New Route - New listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    // Show Route - Show details of one listing
    .get(
        wrapAsync(listingController.showListing)
    )
    //Update Route
    .put( 
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    //Delete Route
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;