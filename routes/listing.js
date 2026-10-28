const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



router
    //Index Route- Shows all listings
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    ); 
    // .post(upload.single("listing[image]"), (req,res) => { 
    //     console.log(req.file);  // Shows the submitted fields in the server terminal
    //     res.send(req.file);  // Shows the parsed fields in the browser
    // });
    

// New Route - New listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id") // Show Route - Show details of one listing
    .get(
        wrapAsync(listingController.showListing)
    ) //Update Route
    .put( 
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
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