/* eslint-disable camelcase */
// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(cookieSession({ name: "session", keys: ["key1", "key2"] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));

// Note: mount other resources here, using the same pattern above
// item routes
const itemsRoutes = require("./routes/items");
// login routes
const loginRoutes = require("./routes/login");
// registeration routes
const registrationRoutes = require("./routes/registration");
// logout routes
const logoutRoutes = require("./routes/logout");
// add item routes
const addItemRoutes = require("./routes/addItem");
const deleteItem = require("./routes/deleteItem");
// categories routes
const categoriesRoutes = require('./routes/categories');
// favorite routes
const favoriteRoutes = require('./routes/favorite');
// cart route
const cartRoute = require("./routes/cart");
//submit order
const submitRoute = require("./routes/submit");





// Mount all resource routes
app.use("/login", loginRoutes(db));
app.use("/register", registrationRoutes(db));
app.use("/logout", logoutRoutes(db));
app.use("/api/items", itemsRoutes(db));
app.use("/add", addItemRoutes(db));
app.use("/delete", deleteItem(db));
app.use('/categories', categoriesRoutes(db));
app.use('/favorite',favoriteRoutes(db));
app.use("/cart", cartRoute(db));
app.use("/submit", submitRoute(db));



// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
// const usersRoutes = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  if (!req.session.user_info){
    templateVar = {
      user : {
        name : null,
        is_admin: null
      }
    }
    res.render("index", templateVar); 
  } else {
    templateVar = {
      user : req.session.user_info
    }
    res.render("index", templateVar);
  }
  res.render("index", user_info);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
