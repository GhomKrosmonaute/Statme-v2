const express = require('express');
const router = express.Router();

router.get('/api', function(req, res, next) {
  // TODO: récupérer une liste des routes
  const routes = []
  res.render('api', { title: 'Statme API', routes });
});

module.exports = router;
