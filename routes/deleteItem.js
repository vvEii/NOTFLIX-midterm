const express = require("express");
const router = express.Router();

// delete item
module.exports = (db) => {
  router.post("/:id", (req, res) => {
    const deleteMovie = `DELETE FROM items WHERE id = $1;`;
    const values = [req.params.id];
    console.log(values);
    db.query(deleteMovie, values)
      .then((data) => {
        const rowCount = data.rowCount;
        res.json({ rowCount });
      })
      .catch((err) => console.log(err));
  });

  return router;
};
