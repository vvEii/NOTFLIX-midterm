const express = require('express');
const router  = express.Router();

// logout user from page
module.exports = (db) => {
  router.post('/', (req, res) => {
    req.session = null;
    res.redirect('/login');
  });

  return router;
};