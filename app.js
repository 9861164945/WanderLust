const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User=require('./models/user.js')
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listingRoute.js");
const reviewRouter = require("./routes/reviewRoute.js");
const userRouter=require('./routes/userRoute.js');
const dotenv=require('dotenv');
const port=process.env.PORT||8080;
dotenv.config();


const MONGO_URL =process.env.MONGODB_URI;

// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Set EJS as the view engine and configure view directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session Configuration
const sessionOptions = {
  secret: "mycode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3, // 3 days
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true
  },
};

// Sessions Middleware
app.use(session(sessionOptions));




// Flash Middleware
app.use(flash());

// Initialize Passport for authentication 
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate())); // Ensure this method exists in the User model
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// Middleware to make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});
// Home Route
// app.get("/", (req, res) => {
//   res.render("listings/home.ejs");
// });

// Example Route that Sets Flash Message
app.post('/listings', (req, res) => {
  // Simulate some logic for creating a listing
  req.flash('success', 'Listing created successfully!');
  res.redirect('/listings');
});

// Route Handlers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

// 404 Error Handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("listings/error.ejs", { message: err.message });
});

// Start Server
app.listen(port, () => {
  console.log("Server is listening on port 8080");
});
