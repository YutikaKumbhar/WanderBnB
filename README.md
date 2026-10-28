# WanderBnB

WanderBnB is a vacation-rental listing web application built with Node.js, Express, MongoDB, and EJS. Users can browse available stays, create and manage listings, upload listing photos, and share reviews.

## Features

- Browse listings and view listing details, photos, and map locations.
- Create an account, log in, and log out.
- Create listings with geocoded locations and uploaded photos.
- Edit or delete listings as their owner.
- Add reviews to listings and delete your own reviews.
- Keep login sessions in MongoDB.
- Validate listing and review submissions.

## Requirements

- Node.js 24.11.0 
- MongoDB Atlas connection string
- Mapbox access token for geocoding and maps
- Cloudinary account for listing image uploads

## Setup

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root and set the following values:

   ```env
   ATLASDB_URL=your_mongodb_connection_string
   SECRET=your_session_secret
   MAP_TOKEN=your_mapbox_access_token
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ```

   Keep the real values private; do not commit `.env` to source control.

3. Start the server:

   ```bash
   node app.js
   ```

4. Open [http://localhost:8080](http://localhost:8080).

## Technology

- **Server:** Node.js, Express
- **Views:** EJS and EJS-Mate
- **Database:** MongoDB with Mongoose
- **Authentication and sessions:** Passport, Passport Local Mongoose, Express Session, and Connect Mongo
- **Uploads:** Multer and Cloudinary
- **Maps and geocoding:** Mapbox
- **Validation:** Joi

## Project layout

- `app.js` — Express application setup and middleware
- `routes/` — Listing, review, and user routes
- `controllers/` — Route handlers
- `models/` — Mongoose models
- `views/` — EJS templates
- `public/` — Client-side JavaScript, styles, and static assets
- `middleware.js` and `schema.js` — Authorization and input validation