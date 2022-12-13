require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Fruit = require("./models/fruits.js");

const app = express();
const port = 3000;

// Set up middleware
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "jsx");
mongoose.set("strictQuery", true);
app.engine("jsx", require("express-react-views").createEngine());

// Setting up Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});

// Seed route - populate the database for testing
app.get("/fruits/seed", (req, res) => {
  Fruit.create(
    [
      {
        name: "grapefruit",
        color: "pink",
        readyToEat: true,
      },
      {
        name: "grape",
        color: "purple",
        readyToEat: false,
      },
      {
        name: "avocado",
        color: "green",
        readyToEat: true,
      },
    ],
    (err, data) => {
      res.redirect("/fruits");
    }
  );
});

// Index = Show all records
app.get("/fruits", (req, res) => {
  Fruit.find({}, (error, allFruits) => {
    res.render("Index", {
      fruits: allFruits, // getting all fruis from db to pass as props
    });
  });
});

// New - Get a form to create a new record
app.get("/fruits/new", (req, res) => {
  res.render("New");
});
// Delete - Delete this one record
app.delete("/fruits/:id", (req, res) => {
  Fruit.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect("/fruits");
  });
});
// Update - Modifying a record
app.put("/fruits/:id", (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  Fruit.findByIdAndUpdate(req.params.id, req.body, (err, updatedFruit) => {
    console.log(updatedFruit);
    res.redirect(`/fruits/${req.params.id}`);
  });
});

// Create - send the filled form to db and create a new record
app.post("/fruits", (req, res) => {
  if (req.body.readyToEat === "on") {
    //if checked, req.body.readyToEat is set to 'on'
    req.body.readyToEat = true; //do some data correction
  } else {
    //if not checked, req.body.readyToEat is undefined
    req.body.readyToEat = false; //do some data correction
  }

  Fruit.create(req.body, (error, createdFruit) => {
    res.redirect("/fruits");
  });
});
// Edit - Get the form with the record to update
app.get("/fruits/:id/edit", (req, res) => {
  Fruit.findById(req.params.id, (err, foundFruit) => {
    //find the fruit
    if (!err) {
      res.render("Edit", {
        fruit: foundFruit, //pass in the found fruit so we can prefill the form
      });
    } else {
      res.send({ msg: err.message });
    }
  });
});

// Show route - Show me a particular record
app.get("/fruits/:indexOfFruitsArray", function (req, res) {
  Fruit.findById(req.params.indexOfFruitsArray, (err, foundFruit) => {
    res.render("Show", {
      fruit: foundFruit,
    });
  });
});
app.listen(port, () => {
  console.log("listening");
});
