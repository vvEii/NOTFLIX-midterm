const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {

  const addUser = function(user) {

    // Checks if user is already in database
    const queryCheck = `SELECT * FROM users WHERE email = $1;`; 
    const userEmail = [user.email]; 

    return db.query(queryCheck, userEmail)
      .then(userData => {
        if (userData.rows.length > 0) {
          return null;
        } else {

        const queryString = `INSERT INTO users (name, password, email, phone_number) VALUES ($1, $2, $3, $4) RETURNING *;`;

        const values = [user.username, user.password, user.email, user.phone];
        return db.query(queryString, values).then(res => res.rows[0]);
        }
      });
  };

  // Renders registration page
  router.get('/', (req, res) => {
    if (req.session.user_info) {
      res.redirect('/');
    } else {
      res.render('register_url');
    }
  }).post('/',(req,res) => {
      const user = req.body;
      user.password = bcrypt.hashSync(user.password, 12);
      // database contains unique emails
    addUser(user)
      .then(user => {
        if (!user) {
          res.status(401).send({ error: "Email already in system!" });
          return;
        }
        req.session.user_info = user;
        res.redirect('/');
      })
      .catch(e => {
        res.send(e)
        console.log(e)
      });
  });


  return router;
};


