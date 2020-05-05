const express = require('express')
const router = express.Router()

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard', refresh: false })
})

module.exports = router
