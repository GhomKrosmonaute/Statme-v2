const express = require('express')
const router = express.Router()
const queryBuilder = require('../utils/database/queryBuilder')

router.get([
  '/dashboard/list/:type',
  '/api/list/:type'
], async function(req, res, next) {
  
  const search = req.query.search
  const sort = req.query.sort
  
  const order = sort === 'activity' ? ['total DESC'] : (
    sort === 'name' ? undefined : undefined
  )
  
  const item = search ? resolveItem(req.client, search) : null
  
  const col = `${req.type.slice(0,req.type.length-1)}_id`
  const items = await queryBuilder( req.db, {
    order,
    where: item ? {[col]: item.id} : undefined,
    select: col + ' AS item_id, COUNT(id) as total',
    group: col,
    limit: 20
  })
  
  res.render('itemsDashboard', {
    title: 'Dashboard | ' + req.type[0].toUpperCase() + req.type.slice(1),
    refresh: req.url,
    items: await Promise.all( items.map( item => item.item_id ).map( id => {
      let item = req.client[req.type].cache.get( id )
      if(!item && req.client[req.type].fetch)
        item = req.client[req.type].fetch( id, false )
      return item
    })),
    type: req.type, search, sort
  })
})

module.exports = router