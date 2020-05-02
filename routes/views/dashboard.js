const express = require('express');
const router = express.Router();
const createError = require('http-errors');

router.get('/dashboard/guild/:guildID', function(req, res, next) {
    // TODO: tester si la guild est dans la DB
    // TODO: tester si l'owner a ouvert la route
    // TODO: récupérer les stats par rapport aux paramètres passés en GET

    /* startTemp */

    const guild = req.client.guilds.cache.get(req.params.guildID)
    if(!guild) return next(createError(404))

    /* endTemp */

    const stats = {}
    res.render('guildDashboard', {
        title: 'Statme Dashboard | ' + guild.name,
        refresh: '/dashboard/guild/' + guild.id,
        guild,
        stats
    });
});

router.get('/dashboard', function(req, res, next) {
    res.render('dashboard', { title: 'Statme Dashboard', refresh: false });
});

module.exports = router;
