const express = require('express');
const router = express.Router();

router.get('/dashboard/:guild', function(req, res, next) {
    // TODO: tester si la guild est dans la DB
    // TODO: tester si l'owner a ouvert la route
    // TODO: récupérer les stats par rapport aux paramètres passés en GET
    const guild = { name: 'GuildName' }
    const stats = {}
    res.render('guildDashboard', { title: 'Statme Dashboard | ' + guild.name, guild, stats });
});

router.get('/dashboard', function(req, res, next) {
    res.render('dashboard', { title: 'Statme Dashboard' });
});

module.exports = router;
