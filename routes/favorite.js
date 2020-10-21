const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log(req.session);
    let queryString = "";
    const value = [];
    db.query(queryString, value)
      .then((data) => {
        const items = data.rows;
        res.json({ items });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  return router;
};
