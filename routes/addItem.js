const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const addItem = function(item) {

    // first check if item is already in database
    const queryCheck = `SELECT * FROM items WHERE name = $1;`; 

    return db.query(queryCheck, [item.name])
      .then(itemData => {
        if (!itemData.rows.length) {
          const queryString = `
          INSERT INTO items (name, owner_id, price, description,thumbnail_url, cover_url, stock)
          VALUES ($1, $2, $3, $4, $5, $6, $7) 
          RETURNING *;
          `;
          const values = [item.name, 1, parseInt(item.price), item.description, item.thumbnail_url, item.cover_url, parseInt(item.stock)];
          return db.query(queryString, values)
            .then(res => {
              return res.rows[0]
            });
        } else {
          return null;
        }
      });
  };
  
  router.get('/', (req, res) => {
    res.render('add_item');
  }).post('/',(req,res) => {
    const item = req.body;
    addItem(item)
      .then(item => {
        if (item === null) {
          res.status(401).send({ error: "item already in system!" });
          return;
        }
        req.session.user_id = user.email;
        res.redirect('/add');
      })
      .catch(console.log);
  });
  
  
  return router;
};