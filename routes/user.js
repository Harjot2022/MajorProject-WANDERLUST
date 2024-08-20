const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middlewarez");
const userController = require("../controller/users");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate('local',
            {failureRedirect: '/login' ,
            failureFlash: true
        }),userController.login
    );

router.get("/logout",userController.logout);

module.exports = router;