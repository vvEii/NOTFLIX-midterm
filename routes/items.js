/*
 * All routes for items are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // load all items from database
  router.get("/all", (req, res) => {
    let queryString = "SELECT * FROM items LIMIT 10";
    db.query(queryString)
      .then((data) => {
        const items = data.rows;
        res.json({ items });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  // load only featured items from database
  router.get("/featured", (req, res) => {
    let queryString =
      "SELECT * FROM items JOIN item_categories ON items.id = item_id JOIN categories ON category_id = categories.id WHERE categories.name LIKE 'featured' LIMIT 10;";
    db.query(queryString)
      .then((data) => {
        const items = data.rows;
        res.json({ items });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  // load items from price low to high
  router.get("/price-low-to-high", (req, res) => {
    let queryString = "SELECT * FROM items ORDER BY items.price LIMIT 10;";
    db.query(queryString)
      .then((data) => {
        const items = data.rows;
        res.json({ items });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  // load items from price high to low
  router.get("/price-high-to-low", (req, res) => {
    let queryString = "SELECT * FROM items ORDER BY items.price DESC LIMIT 10;";
    db.query(queryString)
      .then((data) => {
        const items = data.rows;
        res.json({ items });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  router.get("/details/:id", (req, res) => {
    let queryString =
      "SELECT items.*, AVG(rating) AS avg_rating FROM items JOIN reviews ON items.id = item_id WHERE items.id = $1 GROUP BY items.id;";
    const value = [req.params.id];

    db.query(queryString, value)
      .then((data) => {
        const item = data.rows;
        res.json({ item });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  return router;
};
