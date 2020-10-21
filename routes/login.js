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
    if (req.session.user_info) {
      res.redirect('/');
    } else {
      res.render('login_url');
    }
  })
    .post('/', (req,res) => {
      const { email, password } = req.body;
      login(email, password)
        .then(user => {
          if (!user) {
            res.status(401).send({ error: 'Email or Password don\'t match' });
            return;
          }
          req.session.user_info = user;
          console.log (req.session.user_info);
          res.redirect('/');
        })
        .catch(console.log);
    });
 

  return router;
};



