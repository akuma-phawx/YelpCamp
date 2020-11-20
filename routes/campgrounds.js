const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { isLoggedIn } = require("../middleware");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//Show all campgrounds.
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//Get the form to add a new campground.
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//Get the form to edit an existing campground.
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

//Adding the new campground in the DB.
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Data", 400);

    const camp = new Campground(req.body.campground);
    await camp.save();
    req.flash("success", "Campground successfully made.");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

//Updating Campground
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    req.flash("success", "Campground successfully updated");
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

//Deleting Campground
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Campground successfully deleted");
    res.redirect(`/campgrounds`);
  })
);

//Show a specific campground.
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate("reviews");
    // log(camp);
    if (!camp) {
      req.flash("error", "Campground does not exist");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { camp });
  })
);

module.exports = router;
