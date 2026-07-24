const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() =>{
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    }); 

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("I am root");
});

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
app.get("/listings", wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New Route 
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs", { listing: {}, error: null });
});

// Show Route - Show details of one listing
app.get(
    "/listings/:id", 
    wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// Create Route 
app.post(
    "/listings",
    validateListing, 
    wrapAsync(async (req,res,next) => {
        // const listingData = req.body && req.body.listing ? req.body.listing : req.body;
        let result = listingSchema.validate(req.body);
        console.log(result);
        if (result.error) {
            return next(new ExpressError(400, result.error.message));
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }
));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res,next)=> {
    let {id} = req.params;
    id = id.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400, 'Invalid listing ID'));
    }
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, 'Listing not found'));
    }
    res.render("listings/edit.ejs", {listing});
}));

//Update Route
app.put("/listings/:id", 
    validateListing,
    wrapAsync(async (req, res)=> {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // let { id } = req.params;
    // id = id.trim();
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).send('Invalid listing ID');
    // }

    // const updatedListing = { ...((req.body && req.body.listing) ? req.body.listing : req.body) };
    // if (typeof updatedListing.image === "string") {
    //     const imageUrl = updatedListing.image.trim();
    //     if (imageUrl === "") {
    //         delete updatedListing.image;
    //     } else {
    //         updatedListing.image = { filename: "listingimage", url: imageUrl };
    //     }
    // }

    // const listing = await Listing.findByIdAndUpdate(id, updatedListing, {
    //     runValidators: true,
    //     new: true,
    // });

    // if (!listing) {
    //     return res.status(404).send('Listing not found');
    // }
    res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    id = id.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid listing ID');
    }
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


// app.get("/testListing",async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "California",
//         country: "USA",
//     });

//     await sampleListing.save();
//     console.log('sample was saved');
//     res.send("successful testing");
// });

app.use((req, res, next)=> {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next)=> {
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, ()=> {
    console.log("Server is running on port 8080");
});