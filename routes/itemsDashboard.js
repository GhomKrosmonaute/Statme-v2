const express = require('express')
const router = express.Router()
const queryBuilder = require('../utils/queryBuilder')

router.get([
  '/dashboard/list/:type',
  '/api/list/:type'
], async function(req, res, next) {
  if(!req.type) return next()
  const col = `${req.type.slice(0,req.type.length-1)}_id`
  const items = await queryBuilder( req.db, {
    select: col,
    group: col,
    auto: true,
    limit: 20
  })
  res.render('itemsDashboard', {
    title: 'Dashboard | ' + req.type[0].toUpperCase() + req.type.slice(1),
    refresh: req.url,
    items: await Promise.all(items.map( id => {
      return req.client[req.type].fetch ?
        req.client[req.type].fetch( id, false ) :
        req.client[req.type].cache.get( id )
    }))
  })
})

module.exports = router