const express = require('express');
const router = express.Router();

router.get('/api', function(req, res, next) {
  
  /**
   * @type {express.Route[]}
   */
  const routes = req.app._router.stack
    .filter(r => r.name === 'router')
    .map(r => r.handle.stack)
    .flat()
    .map(r => r.route)
    .flat()
  
  console.log(routes)
  
  res.render('api', { title: 'API Routes', refresh: false, routes });
});

module.exports = router;
