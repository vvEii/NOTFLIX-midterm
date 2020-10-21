const express = require("express");
const router = express.Router();

//delete 
module.exports = (db) => { 
  router.post('/:id', (req, res) => {
    console.log("Here is the ITEEMMM ID -->",req.params.id);
    const deleteMovie = `DELETE FROM items WHERE id = $1;`;

    const values = [req.params.id];

    db.query(deleteMovie,values)
    .then(() => {
      console.log("SUCSSSSSS")
      res.redirect('/');
    });
    
    // redirects to main index page
  });

  return router;
}

