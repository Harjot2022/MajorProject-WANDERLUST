const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newRev = new Review(req.body.review);
    newRev.author = req.user._id;
    listing.reviews.push(newRev);

    await newRev.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=> {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};