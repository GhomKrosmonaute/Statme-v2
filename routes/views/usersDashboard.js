const express = require('express')
const router = express.Router()

router.get('/dashboard/users', function(req, res, next) {
  res.render('typeDashboard', { title: 'Dashboard | Users', refresh: req.url })
})

module.exports = router