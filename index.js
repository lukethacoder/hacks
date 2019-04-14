require('dotenv').config();
const helloWorld = require('./jobs/helloWorld');
const HelperWakatime = require('./helpers/wakatime');
const express = require('express');
const app = express();
const path = require('path');
const CronJob = require('cron').CronJob;
const axios = require('axios');
const request = require('request');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');

const wakaTimeURL = 'https://wakatime.com/api/v1/';
const wakaTimeAuthURL = 'https://wakatime.com/oauth/authorize?';
const wakaTimeTokenURL = 'https://wakatime.com/oauth/token';

const client_id = process.env.WAKATIME_CLIENT_ID;
const client_secret = process.env.WAKATIME_CLIENT_SECRET;
const redirect_uri = process.env.WAKATIME_APP_REDIRECT;
let scope = 'email, read_logged_time, read_stats, read_orgs, read_private_leaderboards';
let stateKey = 'wakatime_auth_state';

let AuthObj = {
  client_id: client_id,
  client_secret: client_secret,
  access_token: '',
  authorization: 'Basic ' + new Buffer.from(client_id + ':' + client_secret).toString('base64'),
};

console.log('expresso starto \u{2615}');

app.use(express.static(path.join(__dirname, '/public'))).use(cookieParser());

const helloWorldCron = new CronJob({
  cronTime: '*/10 * * * * *',
  onTick: function() {
    // cron job code goes here
    helloWorld.main();
  },
  start: false,
  timeZone: 'Australia/Sydney',
});
// helloWorldCron.start();

let generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const port = process.env.PORT || 2345;
app.listen(port, function() {
  console.log('app listening on port: ', port);
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/login', function(req, res) {
  let state = generateRandomString(16);
  res.cookie(stateKey, state.toString(), '/', { expire: 24 * 60 * 60 * 1000 });

  console.log(req.cookies);

  res.redirect(
    wakaTimeAuthURL +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get('/redirect', function(req, res) {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  console.log(req.cookies);

  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_missmatch',
        })
    );
  } else {
    res.clearCookie(stateKey);

    let authOptions = {
      url: 'https://wakatime.com/oauth/token',
      form: {
        code: code,
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' + new Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log('body.refresh_token => ', body.refresh_token);
        console.log('body.access_token => ', body.access_token);
        let access_token = body.access_token,
          refresh_token = body.refresh_token;

        AuthObj.access_token = access_token;

        res.redirect(
          '/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        console.log('response.statusCode => ', response.statusCode);
        console.log('error => ', error);
        res.redirect(
          '/#' +
            querystring.stringify({
              error: 'invalid_token',
            })
        );
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {
  let refresh_token = req.query.refresh_token;
  var authOptions = {
    url: wakaTimeTokenURL,
    headers: {
      Authorization: 'Basic ' + new Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    form: {
      grant_type: 'refresh_token',
      client_id: client_id,
      client_secret: client_secret,
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token;
      AuthObj.access_token = access_token;

      res.send({
        access_token: access_token,
      });
    }
  });
});

app.get('/user', function(req, res) {
  HelperWakatime.userData(AuthObj);
});
app.get('/summaries', function(req, res) {
  HelperWakatime.summaries(AuthObj);
});
