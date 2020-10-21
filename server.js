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
// categories routes
const categoriesRoutes = require('./routes/categories');


// Mount all resource routes
app.use("/login", loginRoutes(db));
app.use("/register", registrationRoutes(db));
app.use("/logout", logoutRoutes(db));
app.use("/api/items", itemsRoutes(db));
app.use("/add", addItemRoutes(db));
app.use('/categories', categoriesRoutes(db));

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  let user_info = {};
  if (!req.session.user_info) {
    user_info = {
      name: null,
      is_admin: null,
    };
  } else {
    user_info = req.session.user_info;
  }
  res.render("index", user_info);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
