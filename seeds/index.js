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
  return arr[Math.floor(Math.random() * arr.length)];
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
    const price = Math.floor(Math.random() * 500) + 10;
    const camp = new Campground({
      title: title,
      author: "5fb909f27f28445458e21d9e",
      location: `${city.city}, ${city.state}`,
      images: [
        {
          url:
            "https://res.cloudinary.com/phawx/image/upload/v1606124339/YelpCamp/ovm2btboeat4u7imbmx5.jpg",
          fileName: "YelpCamp/ovm2btboeat4u7imbmx5",
        },
        {
          url:
            "https://res.cloudinary.com/phawx/image/upload/v1606124342/YelpCamp/k5he9grqko0rmpizcf1e.jpg",
          fileName: "YelpCamp/k5he9grqko0rmpizcf1e",
        },
        {
          url:
            "https://res.cloudinary.com/phawx/image/upload/v1606124343/YelpCamp/wyq3yc2x3afmohuq4llf.jpg",
          fileName: "YelpCamp/wyq3yc2x3afmohuq4llf",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit corrupti quae suscipit modi quos! Minima labore consequuntur in corporis totam, rerum temporibus quis, eveniet est odio nisi, nulla porro odit.",
      price,
    });

    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
  log("Entries added successfully, exiting DB.");
});
