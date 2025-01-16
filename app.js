const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listingRoute.js");
const reviewRouter = require("./routes/reviewRoute.js");
const userRouter = require("./routes/userRoute.js");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGODB_URI;

// Database Connection
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}

// App Configurations
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session Configuration
app.use(
  session({
    secret: "mycode",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 3, // 3 days
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    },
  })
);

// Flash Messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get("/", (req, res) => res.render("listings/home"));
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 Error Handler
app.all("*", (req, res, next) => next(new ExpressError(404, "Page not Found")));

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("listings/error", { message: err.message });
});

// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`));
