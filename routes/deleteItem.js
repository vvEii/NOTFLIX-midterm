const express = require("express");
const router = express.Router();

//delete 
module.exports = (db) => { 
  router.post('/:id', (req, res) => {
  
    const deleteMovie = `DELETE FROM items WHERE id = $1;`;
    const values = [req.params.id];

    db.query(deleteMovie,values)
    .then(() => {
      console.log("SUCSSSSSS")
      res.redirect('/');
    });
  });

  return router;
}

