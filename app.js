const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const { Client } = require('discord.js');
const { createConnection } = require('mysql2');
const initClient = require('./utils/initClient');

const secret = require('./secret.json');

const app = express();
const db = createConnection(secret.database);
const client = new Client({
  disableMentions: "all",
  presence: {
    activity: {
      name: secret.baseURL,
      type: "WATCHING"
    }
  }
});

const clientReady = client.login(secret.botToken)
  .then(() => initClient(client,db));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// insert constants
app.use(async function(req,res,next){
  if(!client.ready) await clientReady;
  req.app = app;
  req.client = client;
  req.secret = secret;
  req.db = db;
  next();
})

// get item of id param and place it in req object
const param = function (req, res, next, id) {
  for(const type of ['guild','user','channel']){
    const cache = req.client[type + 's'].cache
    if(cache.has(id)) {
      req[type] = cache.get(id)
      break
    }
  }
  next()
}

app.param('id', param)

for(const file of fs.readdirSync(path.join(__dirname, 'routes', 'views')))
  app.use('/', require(path.join(__dirname, 'routes', 'views', file)).param('id', param));

for(const file of fs.readdirSync(path.join(__dirname, 'routes', 'api')))
  app.use('/api', require(path.join(__dirname, 'routes', 'api', file)).param('id', param));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: `${err.status || 500} | ${err.message}`,
    refresh: false
  });
});

module.exports = app;