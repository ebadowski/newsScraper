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

/* Things to do
*     comment length w/ materialize char counter
*     phone validation
*     load time
*
*/
// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

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
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";
// mongodb://heroku_bpmjqw3c:m2gss78coe865mb52vhkn423nb@ds353457.mlab.com:53457/heroku_bpmjqw3c
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://ebadowski:badowski4@ds353457.mlab.com:53457/heroku_bpmjqw3c";

mongoose.connect(MONGODB_URI);

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



// Routes

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// gets all tabs
app.get("/tabs/all", function (req, res) {
  db.Tab.find({})
    .then(function (tabs) {
      res.json(tabs);
    });
});

// populates all fields for the specified tab 
  app.get("/articles/:id", function (req, res) {
    db.Tab.findOne({_id:ObjectID(req.params.id)})
    .populate({
      path: 'articles',
      populate: { 
        path: 'comments', 
        populate: {path: 'user', select:'-phone'}
      }
    })
      .then(function (articles) {
        res.json(articles);
      });
  });

// scrapes, making the date tab and article inserts
  app.get("/scrape", function (req, res) {
  scraperResponse = { error: false, message: [], lastTab:{} }
  let today = new Date;
  today = today.toDateString().substring(4);
 
  // creates new date tab
  db.Tab.create({ date: today })
    .catch(function (error) {
      console.log("Tab Post Failed!"); 
      scraperResponse.error = true;
      scraperResponse.message.push("Tab Post Failed!");
    })
    .then((data) => {
      console.log(data)
      scraperResponse.lastTab = data
      return axios.get("https://www.npr.org/sections/news/")
    })
    .then(function (response) {
      var $ = cheerio.load(response.data);
      let entryArr = [];
      $("div.item-info:has(p.teaser)").each(function (i, element) {
        let summary = $('> p', element).text();
        summary = summary.substring(summary.lastIndexOf("•") + 1)
        //console.log(summary)
        let entry = {
          title: $('> h2', element).text(),
          link: $('> h2', element).children().attr("href"),
          summary: summary
        }
        entryArr.push(entry);
      })
      return entryArr;
    })
    .then((insertArr) => {
      return db.Article.insertMany(insertArr)
    })
    .catch(function (error) {
      console.log("Article Post Failed!");
      scraperResponse.error = true;
      scraperResponse.message.push("Article Post Failed!");
    })
    .then((articles) => {
      for (var i in articles) {
        db.Tab.update(
          { date: today },
          { $push: { articles: articles[i]._id } },
          function (err, result) {
            if (err) throw err;
            //res.send(result)
          });
      }
      return "done"
    }).catch(function (error) {
      console.log("Article Push into Tab Failed!", error);
      scraperResponse.error = true;
      scraperResponse.message.push("Article Push into Tab Failed!");
    }).then(() => {
      res.send(scraperResponse);
    })
});


//Route to add comment to article
app.post("/comment/:id", function (req, res) {
  console.log(req.body)
  let articleID = req.params.id;
  let newValues = req.body;
  if (newValues.body && newValues.user) {
    db.Comment.create(newValues, function (err, result) {
      if (err) throw err;
      //res.send(result)
      db.Article.update(
        { _id: ObjectID(articleID) },
        { $push: { comments: result._id } },
        function (err, resultArt) {
          if (err) throw err;
        })
        res.send(result.populate('user'))
    });
  }
  else {
    res.send({ message: "No comment or User data entered" })
  }
});


// Route to make new user
app.post("/users/new", function (req, res) {
  console.log(req.body)

  let newValues = {
    username: req.body.username,
    phone: req.body.phone,
    imgLink: req.body.imgLink
  };

  if (newValues.username && newValues.phone && newValues.imgLink) {
    db.User.create(newValues, function (err, result) {
      if (err) throw err;
      res.send(result)
    })
  } else { res.send({ message: "Incomplete" }) }

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

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});
