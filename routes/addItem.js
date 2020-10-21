const { use } = require('bcrypt/promises');
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
              return res.rows
            });
        } else {
            return null;
        }
      });
  };
      
  // const getUserInfo = function(id) {
  //   const query = `SELECT name, email,phone_number, is_admin  FROM users
  //   WHERE id = $1`;
  //   return db.query(query, [id]) 
  //   .then(userData => {
  //     console.log('userdata', userData.rows[0])
  //     return userData.rows[0]
  //   });
  // }
  
  router.get('/', (req, res) => {
    if (!req.session.user_info){
      res.redirect('/login')
    } else if (req.session.user_info.is_admin) {
      const user = req.session.user_info
      res.render('add_item', user);
    } else {
      res.redirect('/')
    }
  }).post('/',(req,res) => {
    const item = req.body;
    addItem(item)
      .then(item => {
        if (item === null) {
          res.status(401).send({ error: "item already in system!" });
          return;
        }
        // req.session.user_id = user.email;
        res.redirect('/add');
      })
      .catch(console.log);
    });
  
  
  return router;
};