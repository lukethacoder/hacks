require('dotenv').config();
const helloWorld = require('./jobs/helloWorld');
const express = require('express');
const app = express();
const path = require('path');
const CronJob = require('cron').CronJob;

const helloWorldCron = new CronJob({
  cronTime: '*/10 * * * * *',
  onTick: function() {
    // cron job code goes here
    helloWorld.main();
  },
  start: false,
  timeZone: 'Australia/Sydney',
});
helloWorldCron.start();

const port = process.env.PORT || 2345;
app.listen(port, function() {
  console.log('app listening on port: ', port);
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
