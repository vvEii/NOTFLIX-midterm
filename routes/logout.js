

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post('/', (req, res) => {
    req.session = null;
    res.redirect('/login');
  });

  return router;
};