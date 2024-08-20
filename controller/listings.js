const Listing = require("../models/listing.js");
const expressError = require("../utils/ExpressError.js");

module.exports.index = async (req,res) =>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/create.ejs");
};

module.exports.createListing = async (req,res) => {
    let url =  req.file.path;
    let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url,filename };
    await newlisting.save();
    req.flash("success","New listing Created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    let listing =  await Listing.findById(id)
    .populate({
        path:"reviews",
        populate: {
            path :"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you asked for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
};

module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    let editListing = await Listing.findById(id);
    if(!editListing){
        req.flash("error","Listing you asked for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = editListing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_250,w_350");
    res.render("listings/edit.ejs",{editListing,originalImageUrl});
};

module.exports.updateListing = async(req,res) => {
    if(!req.body.listing){
        throw new expressError(400,"Please enter valid data");
    };
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url,filename};
        await listing.save();
    };
    req.flash("success","listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let {id} =  req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};