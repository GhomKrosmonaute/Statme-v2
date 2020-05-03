const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const getGuildStats = require('../../utils/getGuildStats')
const getGraphic = require('../../utils/getGraphic')

router.get('/dashboard/guild/:guildID', async function(req, res, next) {
  // TODO: tester si la guild est dans la DB
  // TODO: tester si l'owner a ouvert la route
  // TODO: récupérer les stats par rapport aux paramètres passés en GET
  
  const guild = req.client.guilds.cache.get(req.params.guildID)
  if(!guild) return next(createError(404))
  
  const stats = {}
  const graph = null
  
  res.render('guildDashboard', {
    title: 'Statme Dashboard | ' + guild.name,
    refresh: '/dashboard/guild/' + guild.id,
    guild, graph
  })
})