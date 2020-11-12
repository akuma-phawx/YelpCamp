const log = console.log;
//My Packages
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Home route
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campground", async (req, res) => {
  const camp = new Campground({ title: "My backyard" });
  await camp.save().then(() => {
    log(camp, " added to DB.");
  });
});

app.listen(8080, () => {
  log("Serving on port 8080.");
});
