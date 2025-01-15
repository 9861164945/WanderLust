const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// Signup routes
router.get("/signup", (req, res) => {
    res.render('users/signup.ejs');
});

router.post("/signup", async (req, res) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username }); // Create a new user instance
    
    try {
        const registeredUser = await User.register(newUser, password); // Call register with the user instance and password
        req.flash("success", "User Registered successfully! Welcome to Wanderlust");
        res.redirect("/");
    } catch (e) {
        console.log(e);
        req.flash("error", "Registration failed. Please try again.");
        res.redirect("/signup");
    }
});

// SignIn
router.get("/login", (req, res) => {
    res.render('users/login.ejs');
});

//




// Login  route Error Handling
router.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error("Error during login:", err); // Print error to console
            req.flash('error', 'An unexpected error occurred. Please try again.'); // Display error message to user
            return next(err);
        }
        if (!user) {
            req.flash('error', info.message || 'Invalid username or password.'); // Display error message if user not found
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error("Error logging in:", err); // Print error to console
                req.flash('error', 'Login failed. Please try again.');
                return next(err);
            }
            req.flash('success', '---Welcome to Wanderlust! You are A Authenticated User--'); // Successful login message
            return res.redirect('/listings'); // Redirect to the  Listing Page
        });
    })(req, res, next);
});
//SignOut
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("Success","Logout Succesfully");
        res.redirect("/");
    })

})


module.exports = router;
