const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {

  const addUser = function(user) {
    const queryString = `
     INSERT INTO users (username, password, email, phone_number)
     VALUES ($1, $2, $3, $3) RETURNING *;
    `;

    const values = [user.username, user.password, user.email, user.phone_number];

    return db.query(queryString, values)
      .then(res => res.rows[0]);
  }

  //{ id: 1, name: 'Devin Sanders', email:'tristanjacobs@gmail.com', password:'$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' }

  router.get('/', (req, res) => {
    res.render('register_url');
  }).post('/',(req,res) => {
      const user = req.body;
      user.password = bcrypt.hashSync(user.password, 12);
      // database unique in emails
      addUser(user)
        .then(user => {
          if (!user) {
            res.status(401).send({ error: "Email already in system!" });
            return;
          }
          req.session.user_id = user.email;
          res.redirect('/');
        })
        .catch(e => res.send(e));
  });


  return router;
};

