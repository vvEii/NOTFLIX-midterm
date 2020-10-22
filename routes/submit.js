const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.get('/', (req, res) => {
    const templateVar = {
      user : req.session.user_info,
    }
    res.render('Submit', templateVar);
  })


  return router;
};