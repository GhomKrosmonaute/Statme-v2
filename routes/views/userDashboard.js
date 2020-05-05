const express = require('express')
const router = express.Router()
const moment = require('moment')
const createError = require('http-errors')
const getUserStats = require('../../utils/getUserStats')
const getGraphic = require('../../utils/getGraphic')
const { TIME } = require('../../utils/enums')

router.get('/dashboard/user/:id', async function(req, res, next){
  
  const user = req.user
  if(!user) return next(createError(301))
  
  const from = new Date(req.query.from).getTime() || (Date.now() - TIME.MONTH)
  const to = new Date(req.query.to).getTime() || Date.now()
  const per = TIME.hasOwnProperty(req.query.per) ? req.query.per : 'DAY'
  
  const toDate = moment(to).format('YYYY-MM-DD')
  const fromDate = moment(from).format('YYYY-MM-DD')
  
  const stats = await getUserStats( req.db, user, {from, to, per})
  const graph = await getGraphic( stats, { width: 400, height: 200 })
  
  res.render('userDashboard', {
    title: 'Dashboard | ' + user.username,
    refresh: `/dashboard/user/${user.id}?from=${from}&per=${per}&to=${to}`,
    user, graph, fromDate, toDate, per
  })
})

module.exports = router