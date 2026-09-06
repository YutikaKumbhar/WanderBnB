const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const defaultImageUrl = "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60";
const normalizeImage = (value) => {
    if (typeof value === "string") {
        return { filename: "listingimage", url: value || defaultImageUrl };
    }

    if (value && typeof value === "object") {
        return {
            filename: value.filename || "listingimage",
            url: value.url || defaultImageUrl,
        };
    }

    return { filename: "listingimage", url: defaultImageUrl };
};

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: new Schema({
            filename: { type: String, default: "listingimage" },
            url: {
                type: String,
                default: defaultImageUrl,
                set: (v) => (v === "" ? defaultImageUrl : v),
            },
        }, { _id: false }),
        default: () => ({ filename: "listingimage", url: defaultImageUrl }),
        set: normalizeImage,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
