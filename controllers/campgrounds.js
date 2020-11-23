const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const campground = require("../models/campground");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const camp = new Campground(req.body.campground);
  camp.geometry = geoData.body.features[0].geometry;
  camp.images = req.files.map((f) => ({ url: f.path, fileName: f.filename }));
  camp.author = req.user._id;
  console.log(camp);
  await camp.save();
  req.flash("success", "Campground successfully made.");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.renderUpdateForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground) {
    req.flash("error", "404 No Campground");
    return res / redirect(`/campgrounds/${id}`);
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body.delBabe);
  const camp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, fileName: f.filename }));
  camp.images.push(...imgs);

  if (req.body.delBabe) {
    for (let fileName of req.body.delBabe) {
      await cloudinary.uploader.destroy(fileName);
    }
    await camp.updateOne({
      $pull: { images: { fileName: { $in: req.body.delBabe } } },
    });
  }

  await camp.save();
  req.flash("success", "Campground successfully updated");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Campground successfully deleted");
  res.redirect(`/campgrounds`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!camp) {
    req.flash("error", "Campground does not exist");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { camp });
};
