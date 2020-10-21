const express = require("express");
const router = express.Router();

module.exports = (db) => {
  
  router.get("/:category", (req, res) => {
    let queryString =
      "SELECT items.*, AVG(reviews.rating) AS avg_rating FROM items JOIN item_categories ON items.id = item_categories.item_id JOIN categories ON item_categories.category_id = categories.id LEFT JOIN reviews ON items.id = reviews.item_id WHERE categories.name LIKE $1 GROUP BY items.id,categories.name ORDER BY items.id;";
    const value = [`%${req.params.category}%`];
    db.query(queryString, value)
      .then((data) => {
        const items = data.rows;
        res.json({ items });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  return router;
};
