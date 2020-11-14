const log = console.log;
//My Packages
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/campground");

//connecting to mongo
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

//handling mongo errors
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  log("Database Connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//Home route
app.get("/", (req, res) => {
  res.render("home");
});

//Show all campgrounds.
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//Get the form to add a new campground.
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//Get the form to edit an existing campground.
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

//Adding the new campground in the DB.
app.post(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

//Updating Campground
app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

//Deleting Campground
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect(`/campgrounds`);
  })
);

//Show a specific campground.
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/show", { camp });
  })
);

//Error handler
app.use((err, req, res, next) => {
  res.send("Oh boy, something went wrong");
});

//Express listening on 8080.
app.listen(8080, () => {
  log("Serving on port 8080.");
});
