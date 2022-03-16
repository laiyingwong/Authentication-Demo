const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./model/user");

// ***********************
// INTEGRATE MONGO WITH JS
// ***********************
// Connect JS file to a Mongo database via Mongoose
// Create a database called 'authDemo'
mongoose
  .connect("mongodb://localhost:27017/authDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

// ***************************
// SET UP MIDDLEWARE & SESSION
// ***************************
// Set up the path for 'views' directory
app.set("views", path.join(__dirname, "views"));
// Set EJS as the view engine
app.set("view engine", "ejs");

// To parse form data in POST request body as url encoded data (otherwise req.body is undefined):
app.use(express.urlencoded({ extended: true }));

// Set up a Session
const sessionOptions = {
  secret: "imasecret",
  resave: false, // used to avoid deprecated warning
  saveUninitialized: false, // used to avoid deprecated warning
};
app.use(session(sessionOptions));

// Define a middleware to require login
const requiredLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

// *********************
// SET UP EXPRESS ROUTES
// *********************

// ============== Home Page ==============
app.get("/", (req, res) => {
  res.render("home");
});

// ============ Register Page ============
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { password, username } = req.body;
  // ↓ the 2nd parameter is the difficulty level for the hash (aka the amount of time it takes to compute a hash). The lower the number is, the faster the hashing process will be and it will grow exponentially. The recommended minimum number is 12.
  // hash returns the hashed password
  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    username,
    password: hash,
  });
  await user.save();
  req.session.user_id = user._id;
  res.redirect("/");
});

// ============= Login Page =============
app.get("/login", (req, res) => {
  res.render("login");
});

// app.post("/login", async (req, res) => {
//   const { password, username } = req.body;
//   const user = await User.findOne({ username });
//   console.log(user);
//   // To verify the password: compare the plain password with the hashed password in the database. It will return a boolean value.
//   const validPassword = await bcrypt.compare(password, user.password);
//   if (validPassword) {
//     // if the user is successfully logged in, store the user id in the session
//     req.session.user_id = user._id;
//     res.redirect("/secret");
//   } else {
//     res.send("Try again!");
//   }
// });

// With static method defined in user.js
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findAndValidate(username, password);
  if (foundUser) {
    // if the user is successfully logged in, store the user id in the session
    req.session.user_id = foundUser._id;
    res.redirect("/secret");
  } else {
    res.redirect("/login");
  }
});

// ============= Logout Page =============
app.get("/logout", (req, res) => {
  // req.session.user._id = null;
  // OR
  req.session.destroy();
  res.redirect("/login");
});

// ============= Secret Page =============
app.get("/secret", requiredLogin, (req, res) => {
  res.render("secret");
});

// *******
// SERVER
// *******
app.listen(3000, () => {
  console.log("Serving on port 3000!");
});
