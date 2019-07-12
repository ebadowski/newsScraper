// Dependencies
var express = require("express");
var path = require("path");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var ObjectID = require('mongodb').ObjectID;
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "newsscraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


app.get("/all", function (req, res) {
  db.newsscraper.find({}, function (err, data) {
    if (err) console.log(err);
    else res.json(data);
  });
});


app.get("/scrape", function (req, res) {
  let elArr = []
  axios.get("https://www.npr.org/sections/news/").then(function (response) {
    var $ = cheerio.load(response.data);

    $("div.item-info:has(p.teaser)").each(function (i, element) {

      let title = $('> h2', element).text();
      let link = $('> h2', element).children().attr("href");

      let summary = $('> p', element).text();
      //to avoid duplicate entries in the db
      db.newsscraper.createIndex({ "title": 1 }, { unique: true })

      db.newsscraper.insert({
        title: title,
        link: link,
        summary: summary
      }, { upsert: true }, function (err, data) {
        if (err) console.log(err);
      });

    });
  });
  res.send(res.data);
});

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

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
