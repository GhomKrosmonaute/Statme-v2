const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const { Client } = require('discord.js');
const { createConnection } = require('mysql2');
const initClient = require('./utils/discord/initClient');

const secret = require('./secret.json');

const app = express();
const db = createConnection(secret.database);
db.config.namedPlaceholders = true;
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
  req.debug = (secret.debugPassword === req.query.debug);
  req.app = app;
  req.client = client;
  req.secret = secret;
  req.db = db;
  next();
})

// get item of id param and place it in req object
const paramID = async function (req, res, next, id) {
  for(const type of ['guild','channel','user']){
    const list = req.client[type + 's']
    req.item = list.cache.get(id)
    if(!req.item && list.fetch) {
      try{
        req.item = await list.fetch(id, false)
      }catch(error){}
    }
    if(req.item) {
      req.type = type
      break
    }
  }
  if(!req.type) next(createError(404));
  else next()
}

const paramType = function (req, res, next, type) {
  if(/^(?:channel|guild|user)s$/i.test(type))
    req.type = type
  if(!req.type) next(createError(404));
  else next()
}

app
  .param('id', paramID)
  .param('type', paramType)

for(const file of fs.readdirSync(path.join(__dirname, 'routes')))
  app.use('/',
    require(path.join(__dirname, 'routes', file))
      .param('id', paramID)
      .param('type', paramType)
  );

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
    refresh: req.url,
    debug: req.debug
  });
});

module.exports = app;