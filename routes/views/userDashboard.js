const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const getUserStats = require('../../utils/getUserStats')
const getGraphic = require('../../utils/getGraphic')

router.get('/dashboard/user/:userID', async function(req, res, next){
  
  const user = req.client.users.cache.get(req.params.userID)
  if(!user) return next(createError(404))
  
  /**
   * @type {Rate[]}
   */
  const stats = [] // await getUserStats( req.db, user )
  
  // faker
  for(let i=0; i<100; i+=10){
    stats.push({
      period: {
        start: i,
        stop: i + 10,
        duration: 10
      },
      value: Math.random()
    })
  }
  
  const graph = getGraphic(stats,{width:600,height:200})
  
  res.render('userDashboard', {
    title: 'Statme Dashboard | @' + user.username,
    refresh: '/dashboard/user/' + user.id,
    user, graph
  })
})