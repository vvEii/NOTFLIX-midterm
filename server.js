// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const sass = require("node-sass-middleware");
const bcrypt = require('bcrypt');
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();
//test the database connection
db.query("SELECT * FROM test;").then((res) => console.log(res.rows));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(cookieSession({ name: 'session', keys: ['key1', 'key2'] }));
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

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  res.render("index");
});

//get register
app.get('/register', (req, res) => {
  res.render('register_url');
});

app.get('/login', (req, res) => {
  res.render('login_url');
});

// register post 
app.post('/register', (req, res) => {
  const { username, password, email, phone } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userValues = [username, hashedPassword, email, phone];

  //  req.session.user_id = email;

  //checks if info is present already 
  const queryCheck = `
  SELECT username, password, email, phone_number 
  FROM users 
  WHERE username = $1 AND password =$2 AND email =$3 AND phone_number =$4;
  `;

  db.query(queryCheck, userValues)
    .then(result => {
      if (result.rows.length > 0) {
        res.status(400).send("Email is already in the system!");
      } else {
        //if info is not present then insert information
        // no administrator present cuz set to default in database
        const queryString = `INSERT INTO users (username, password, email, phone_number) VALUES ($1, $2, $3, $4) RETURNING *;`;
        db.query(queryString, userValues)
          .then(result => {
            req.session.user_id = result.rows[0].email; //-> not working
            // redirect to home listing --> change
            res.redirect('/');
          });
      }
    });
});

// login post 
app.post('/login', (req, res) => {
  const {email, password} = req.body;
  const values = [email, password];
  
  const queryString = `
  SELECT email, password
  FROM users 
  WHERE email = $1 AND password = $2;
  `; 

  db.query(queryString, values)
  .then(result => {
    const passwordCompare = bcrypt.compareSync(password, result.rows[0].password);
    const emailCompare = (email!== result.rows[0].email); 

    if(emailCompare && !passwordCompare) {
      res.status(403).send("Email or Password don't match");
    } else {
      req.session.user_id = result.rows[0].email;
      // redirect to home listing --> change
      res.redirect('/');
    }
  });
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

