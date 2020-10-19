const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {

  const login = function(email, password) {
    const queryString = `
    SELECT * FROM users 
    WHERE email = $1;
   `;

    const values = [email];

    return db.query(queryString, values)
      .then(res => res.rows[0])
      .then(user => {
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      });
  };

  router.get('/', (req, res) => {
    res.render('login_url');
  })
    .post('/', (req,res) => {
      const { email, password } = req.body;
      login(email, password)
        .then(user => {
          if (!user) {
            res.status(401).send({ error: "Email or Password don't match" });
            return;
          }
          req.session.user_id = user.email;
          res.send({ user: { id: user.id, name: user.username, email: user.email, phone: user.phone_number } });
          res.redirect('/');
        })
        .catch(e => res.send(e));
    });
 

  return router;
};



