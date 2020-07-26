const express = require('express');
const router = express.Router();

router.get('/bot', function(req, res, next) {
  const commands = req.client.commands.keyArray()
  res.render('bot', { title: 'Bot', refresh: false, commands });
});

module.exports = router;
