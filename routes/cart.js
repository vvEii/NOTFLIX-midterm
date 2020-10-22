const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  const userOrder = function(userId) {
          const queryString = `
          SELECT orders.id, items.price,items.name as movie, users.name, users.email 
          FROM users
          JOIN orders ON users.id = user_id
          JOIN items ON orders.item_id = items.id
          WHERE users.id = $1;
          `;
          const values = [userId];
          return db.query(queryString, values)
            .then(res => {
              return res.rows;
            });
  };

  const DeleteOrder = function(orderId) {
    const queryString = `
    DELETE 
    FROM orders
    WHERE id = $1;
    `;
    const values = [orderId];
    return db.query(queryString, values)
      .then(res => {
        return;
      });
};

  const totalPrice = function (order) {
    let total = 0;
    for (let item of order) {
      total += item.price;
    }
    return total;
  }

  router.get('/', (req, res) => {
    const user_id = req.session.user_info.id;
    userOrder(user_id)
    .then(order => {
        const templateVar = {
          user : req.session.user_info,
          orders : order,
          total : totalPrice(order)
        }
        console.log(order);
        res.render('cart', templateVar);
      });

  }).post('/', (req, res) => {
    DeleteOrder(req.body.id)
      .then(res.redirect('/cart'));
  })

  return router;
};