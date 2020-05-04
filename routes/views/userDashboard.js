const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const getUserStats = require('../../utils/getUserStats')
const getGraphic = require('../../utils/getGraphic')
const constrain = require('../../utils/constrain')
const { TIME } = require('../../utils/enums')

router.get('/dashboard/user/:id', async function(req, res, next){
  
  const user = req.user
  if(!user) return next(createError(301))
  
  const from = Number(req.query.from) || (Date.now() - TIME.MONTH)
  const to = Number(req.query.to) || Date.now()
  const per = TIME.hasOwnProperty(req.query.per) ? req.query.per : 'DAY'
  
  const stats = await getUserStats( req.db, user, {from, to, per})
  const graph = await getGraphic( stats, { width: 400, height: 200 })
  
  res.render('userDashboard', {
    title: 'Dashboard | ' + user.username,
    refresh: `/dashboard/user/${user.id}?from=${from}&per=${per}&to=${to}`,
    user, graph, from, per, to
  })
})

module.exports = router