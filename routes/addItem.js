const { use } = require('bcrypt/promises');
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const addItem = function(item, user) {
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
          const values = [item.name, user, parseInt(item.price), item.description, item.thumbnail_url, item.cover_url, parseInt(item.stock)];
          return db.query(queryString, values)
            .then(res => {
              const movie_id = res.rows[0].id;
              let queryInsert = `
              INSERT INTO item_categories (item_id, category_id)
              VALUES `
              const itemCatValues = [movie_id];
              let counter = 2;
              for (let id = 0; id < item.multi.length ; id++) {
                if (id === item.multi.length - 1) {
                  queryInsert += `($1, $${counter})\n`;
                  itemCatValues.push(item.multi[id]);
                  counter ++;
                } else {
                  queryInsert += `($1, $${counter}),\n`;
                  itemCatValues.push(item.multi[id]);
                  counter ++;
                }
              };
              queryInsert += `RETURNING *;`;
              return db.query(queryInsert, itemCatValues)
                .then(res => {
                  return res.rows;
                });
              });
        } else {
            return null;
        }
    });

  };

  const getCategories = function (){
    return db.query (`SELECT * FROM categories;`)
      .then(res => {
        return res.rows;
      });
  };
  
  router.get('/', (req, res) => {
    if (!req.session.user_info){
      res.redirect('/login')
    } else if (req.session.user_info.is_admin) {
      getCategories()
        .then(catData => {
          templateVar = {
            user : req.session.user_info,
            data : catData
          }
          res.render('add_item', templateVar);
        });
    } else {
      res.redirect('/')
    }
  }).post('/',(req,res) => {
    const item = req.body;
    const user_id = req.session.user_info.id;
    addItem(item, user_id)
      .then(item => {
        if (item === null) {
          res.status(401).send({ error: "item already in system!" });
          return;
        }
        res.redirect('/');
      })
      .catch(console.log);
    });
  
  
  return router;
};