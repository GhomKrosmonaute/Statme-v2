const express = require('express');
const router = express.Router();

/* GET home page. */
router.get(['/','/home'], function(req, res, next) {
  res.render('home', { title: 'Statme', refresh: false });
});

module.exports = router;
