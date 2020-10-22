const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/add", (req, res) => {
    let queryString =
      "INSERT INTO reviews (order_id, item_id, user_id, rating, message) values (null, $1, $2, $3, $4) RETURNING *;";
    const itemID = req.body.itemID;
    const userID = req.session.user_info.id;
    const rating = req.body.rating;
    const message = req.body.message;

    const value = [itemID, userID, rating, message];
    db.query(queryString, value)
      .then((data) => {
        const items = data.rows;
        console.log(items);
        res.json({ items });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  return router;
};
