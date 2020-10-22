const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (!req.session.user_info) {
      res.json({ response: "please login to see your favorite movies" });
    }
    const userID = req.session.user_info.id;
    let queryString = `SELECT items.* , AVG(rating) AS avg_rating, favorite_items.user_id
    FROM items
    JOIN favorite_items ON items.id = favorite_items.item_id
    JOIN users ON favorite_items.user_id = users.id
    LEFT JOIN reviews ON items.id = reviews.item_id
    WHERE favorite_items.user_id = $1
    GROUP BY items.id, favorite_items.user_id;`;
    const value = [userID];
    db.query(queryString, value)
      .then((data) => {
        const items = data.rows;
        res.json({ items });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  router.post("/add", (req, res) => {
    const queryString = `
    insert into favorite_items (user_id, item_id) values ($1, $2) RETURNING *;
    `;
    const userID = req.session.user_info.id;
    const itemID = parseInt(req.body.itemID);
    const value = [userID, itemID];
    db.query(queryString, value)
      .then((data) => {
        const favoriteItem = data.rows[0];
        res.json({ favoriteItem });
      })
      .catch((err) => console.log(err));
  });
  return router;
};
