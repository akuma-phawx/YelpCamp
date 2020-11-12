const log = console.log;
//My Packages
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");
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

const randomSample = (arr) => {
  arr[Math.floor(Math.random() * arr.length)];
};

//Creating 50 entries to work with.
const seedDb = async () => {
  //Deleting at start.
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    //Cities have 1000 different ..cities.. soo. yep.
    const random1000 = Math.floor(Math.random() * 1000);
    const city = cities[random1000];

    //Random Title
    const randomDescriptor = randomSample(descriptors);
    const randomPlace = randomSample(places);
    const title = `${randomDescriptor} ${randomPlace}`;

    const camp = new Campground({
      title: title,
      location: `${city.city}, ${city.state}`,
    });

    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
  log("Entries added successfully, exiting DB.");
});
