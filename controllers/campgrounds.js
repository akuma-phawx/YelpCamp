const campground = require("../models/campground");
const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const camp = new Campground(req.body.campground);
  camp.images = req.files.map((f) => ({ url: f.path, fileName: f.filename }));
  camp.author = req.user._id;
  await camp.save();
  console.log(camp);
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

  const camp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({ url: f.path, fileName: f.filename }));
  camp.images.push(...imgs);
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
