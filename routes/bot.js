const express = require('express');
const router = express.Router();

router.get('/bot', function(req, res, next) {
  // TODO: récupérer la liste des commandes du bot
  const commands = req.client.commands.keyArray()
  res.render('bot', { title: 'Bot', refresh: false, commands });
});

module.exports = router;
