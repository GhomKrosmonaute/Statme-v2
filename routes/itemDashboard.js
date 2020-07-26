const express = require('express')
const router = express.Router()
const moment = require('moment')
const resolve = require('../utils/resolveType')
const getStats = require('../utils/getStats')
const getGraphic = require('../utils/getGraphic')
const { TIME } = require('../utils/enums')

router.get([
  '/dashboard/:id',
  '/api/:id'
], async function(req, res, next){
  
  const item = req.item
  const type = resolve(item)
  
  const from = new Date(req.query.from).getTime() || (Date.now() - TIME.MONTH)
  const to = new Date(req.query.to).getTime() || Date.now()
  const per = TIME.hasOwnProperty(req.query.per) ? req.query.per : 'DAY'
  
  const toDate = moment(to).format('YYYY-MM-DD')
  const fromDate = moment(from).format('YYYY-MM-DD')
  
  let stats = await getStats( req.db, item, {from, to, per})
  const graph = getGraphic( stats ).toDataURL()
  
  if(/\/api\//i.test(req.url))
    res.status(200).json({
      stats, graph
    })
  else res.render('itemDashboard', {
    title: `Dashboard | ${item.name || item.username}`,
    refresh: req.url,
    item, stats, graph,
    toDate, fromDate
  })
})

module.exports = router