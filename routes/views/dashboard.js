const express = require('express')
const router = express.Router()
const createError = require('http-errors')

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Statme Dashboard', refresh: false })
})

module.exports = router
