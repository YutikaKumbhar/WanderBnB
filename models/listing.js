const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
});

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: String,
//     image: {
//         type: new Schema({
//             filename: { type: String, default: "listingimage" },
//             url: {
//                 type: String,
//                 default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
//                 set: (v) => (v === "" ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60" : v),
//             },
//         }, { _id: false }),
//         set: function (v) {
//             // Allow passing a string (URL) or an object; normalize to object
//             if (typeof v === "string") {
//                 return { filename: "listingimage", url: v };
//             }
//             return v;
//         },
//     },
//     price: Number,
//     location: String,
//     country: String,
// });

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
