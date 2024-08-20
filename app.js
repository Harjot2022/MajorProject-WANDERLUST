if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
};


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path =  require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/ExpressError.js");
const multer = require("multer");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport =  require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./models/user.js");

let db_Url = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to db");
}).catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(db_Url);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: db_Url,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error",() => {
    console.log("ERROR in mongo session store",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

//base route
// app.get("/",(req,res) => {
//     res.send("root is working");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next) => {
    next(new expressError(404,"page not found"));
})

//Error handling
app.use((err,req,res,next) =>{
    let {status=500,message="something went wrong"} = err;
    res.status(status).render("./listings/error.ejs",{err});
})

//Listening route
app.listen("8080", (req,res) => {
    console.log("port is listening");
});