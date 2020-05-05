const express = require('express');
const router = express.Router();

router.get('/api', function(req, res, next) {
  
  /**
   * @type {express.Route[]}
   */
  const routes = req.app._router.stack
    .filter(r => r.name === 'router')
    .map(r => r.handle.stack)
    .flat(1)
    .map(r => r.route)
  
  console.log(routes)
  
  res.render('api', { title: 'API Routes', refresh: false, routes });
});

module.exports = router;
