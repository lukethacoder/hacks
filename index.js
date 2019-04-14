require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const CronJob = require('cron').CronJob;
const request = require('request');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');

// Routers
const wakatimeRouter = require('./routes/wakatime');

console.log('expresso starto \u{2615}');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

const helloWorldCron = new CronJob({
  cronTime: '*/10 * * * * *',
  onTick: function() {
    // cron job code goes here
    // helloWorld.main();
  },
  start: false,
  timeZone: 'Australia/Sydney',
});
// helloWorldCron.start();

const port = process.env.PORT || 2345;
app.listen(port, function() {
  console.log('app listening on port: ', port);
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

// Wakatime Router
app.use('/wakatime', wakatimeRouter).use(cookieParser());
