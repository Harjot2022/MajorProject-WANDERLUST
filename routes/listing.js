if( process.env.NODE_ENV != "production" ){
    require('dotenv').config();
};

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner,validateListing} = require("../middlewarez.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))  //Index route
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)) //Create Route

    //New route
router.get("/new",
        isLoggedIn,
        listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) //Show route
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)) //update route
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)) //delete route
            
//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

module.exports = router;