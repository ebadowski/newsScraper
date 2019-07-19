// Dependencies
var express = require("express");
var path = require("path");
var mongojs = require("mongojs");
var logger = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var ObjectID = require('mongodb').ObjectID;
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");



// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// // Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

mongoose.connect(MONGODB_URI);
// // Database configuration
// var databaseUrl = "newsscraper";
// var collections = ["scrapedData"];

// // Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function (error) {
//   console.log("Database Error:", error);
// });
//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



// Routes

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});


app.get("/all", function (req, res) {
  db.Article.find({})
    //poppulate users in comments excluding phone number
    .populate("users", "-phone")
    .then(function (articles) {
      res.json(articles);
    });
});


app.get("/scrape", function (req, res) {
  let elArr = []
  axios.get("https://www.npr.org/sections/news/").then(function (response) {
    var $ = cheerio.load(response.data);

    $("div.item-info:has(p.teaser)").each(function (i, element) {

      let entry = {
        title: $('> h2', element).text(),
        link: $('> h2', element).children().attr("href"),
        summary: $('> p', element).text()
      }
          db.Article.create(entry, function (err, data) {
            if (err) console.log(err);
          });

    });
  });
  res.send(res.data);
});

//Route to add comment to article
app.post("/comment/:id", function (req, res) {
  console.log(req.body)
  let comment = req.body; //will it be a string or object? need string
  let id = req.params.id;
  let myQuery = { _id: ObjectID(id) };
  let newValues = { $push: { comments: comment } };
  //let newValues = { $push: comment };
  if (comment.comment && comment.user) {
    db.newsscraper.update(myQuery, newValues, function (err, res) {
      if (err) throw err;
    });
  }
  else {
    res.send({ message: "No comment or User data entered" })
  }
  res.send({ message: "Done" })
});


// Route to make new user
app.post("/users/new", function (req, res) {
  console.log(req.body)
  let result = { message: "Incomplete" };
  let newValues = {
    username: req.body.username,
    phone: req.body.phone,
    imgLink: req.body.userimg
  };

  if (newValues.username && newValues.phone && newValues.imgLink) {
    db.User.create(newValues, function (err, res) {
      if (err) throw err;
    })
    result = newValues;
  }
  res.send(result)
});

//route to log user in
app.get("/users/:username&:phone", function (req, res) {
  let query = {
    username: req.params.username,
    phone: req.params.phone
  };
  db.User.find(query).then(function (user) {
    res.json(user[0])
  });
});

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
