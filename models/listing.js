const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: {
//         type: String, 
//         required: true
//     },
//     description: String,
//     image: {
//         default: "https://unsplash.com/photos/silhouette-of-palm-tree-near-body-of-water-during-sunset-CXyz3qljaH8",
//         type:String,
//         set: (v) => v ==="" ? "https://unsplash.com/photos/silhouette-of-palm-tree-near-body-of-water-during-sunset-CXyz3qljaH8" : v,
//     },
//     price: Number,
//     location: String,
//     country: String,
// });

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
                default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
                set: (v) => (v === "" ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60" : v),
            },
        }, { _id: false }),
        set: function (v) {
            // Allow passing a string (URL) or an object; normalize to object
            if (typeof v === "string") {
                return { filename: "listingimage", url: v };
            }
            return v;
        },
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
