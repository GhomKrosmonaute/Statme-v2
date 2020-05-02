const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const { Client } = require('discord.js');
const { createConnection } = require('mysql2')

const secret = require('./secret.json');

const app = express();
const client = new Client({ disableMentions: "all" });
const clientReady = client.login(secret.botToken).then(() => console.log('client ready'));
const db = createConnection(secret.database);

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
  await clientReady;
  req.client = client;
  req.secret = secret;
  req.db = db;
  next();
})

for(const file of fs.readdirSync(path.join(__dirname, 'routes', 'views')))
  app.use('/', require(path.join(__dirname, 'routes', 'views', file)));

for(const file of fs.readdirSync(path.join(__dirname, 'routes', 'api')))
  app.use('/api', require(path.join(__dirname, 'routes', 'api', file)));

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