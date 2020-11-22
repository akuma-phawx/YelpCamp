const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

//Show all campgrounds.
router.get("/", catchAsync(campgrounds.index));

//Get the form to add a new campground.
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

//Get the form to edit an existing campground.
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderUpdateForm)
);

//Adding the new campground in the DB.
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

//Updating Campground
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

//Deleting Campground
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

//Show a specific campground.
router.get("/:id", catchAsync(campgrounds.showCampground));

module.exports = router;
