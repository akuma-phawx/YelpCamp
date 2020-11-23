const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

//Get the form to add a new campground.
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

//Get the form to edit an existing campground.
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderUpdateForm)
);

router
  .route("/:id")
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
  .get(catchAsync(campgrounds.showCampground));

module.exports = router;
