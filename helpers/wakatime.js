// login and auth for wakatime
const axios = require('axios');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const request = require('request');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const globalFunctions = require('./functions');

const wakaTimeURL = 'https://wakatime.com/api/v1/';

// Wakatime Data Endpoints
module.exports = {
  main: function(AuthObj) {
    console.log(AuthObj);
  },
  userData: function(AuthObj) {
    console.log('HelperWakatime.userData()');
    axios({
      method: 'get',
      url: `${wakaTimeURL}users/current`,
      responseType: 'json',
      params: {
        client_id: AuthObj.client_id,
        client_secret: AuthObj.client_secret,
        access_token: AuthObj.access_token,
      },
      headers: {
        Authorization: AuthObj.authorization,
      },
    })
      .then(function(res) {
        console.log('---');
        console.warn('user email => ', res.data.data.email);
        console.warn('user display_name => ', res.data.data.display_name);
        console.warn('user website => ', res.data.data.website);
        console.log('---');
        fs.writeFile(
          `test_data/${res.data.data.display_name}-user.json`,
          JSON.stringify(res.data),
          'utf8',
          err => {
            if (err) throw err;
            console.log(`${res.data.data.display_name}-user.json file has been saved!`);
          }
        );
        console.log('res.status => ', res.status);
        console.log('date => ', res.headers.date);
        return 'success';
      })
      .catch(function(error) {
        console.error(error);
      });
  },
  summaries: function(AuthObj) {
    console.log('HelperWakatime.summaries()');
    const today = new Date();
    const one_am = 'T01:00:10Z';
    // current time minus one week in milliseconds
    const lastWeekMilli = Date.now() - 604800000;
    const prettyWeek = new Date(lastWeekMilli);
    const lastWeekSplit = {
      day: prettyWeek.getDate() < 9 ? '0' + prettyWeek.getDate() : prettyWeek.getDate(),
      month:
        prettyWeek.getMonth() + 1 < 9
          ? '0' + (prettyWeek.getMonth() + 1)
          : prettyWeek.getMonth() + 1,
      year: prettyWeek.getFullYear(),
    };
    const todaySplit = {
      day: today.getDate() < 9 ? '0' + today.getDate() : today.getDate(),
      month: today.getMonth() + 1 < 9 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1,
      year: today.getFullYear(),
    };

    const start_date = `${lastWeekSplit.year}-${lastWeekSplit.month}-${lastWeekSplit.day}`;
    const end_date = `${todaySplit.year}-${todaySplit.month}-${todaySplit.day}`;

    axios({
      method: 'get',
      url: `${wakaTimeURL}users/current/summaries`,
      responseType: 'json',
      params: {
        client_id: AuthObj.client_id,
        client_secret: AuthObj.client_secret,
        access_token: AuthObj.access_token,
        start: `${start_date}T01:00:10Z`,
        end: `${end_date}T01:00:10Z`,
      },
      headers: {
        Authorization: AuthObj.authorization,
      },
    })
      .then(function(res) {
        console.log('---');
        console.warn('all data => ', res.data.data);
        fs.writeFile(
          `test_data/${start_date.toString()}-${end_date.toString()}-summaries.json`,
          JSON.stringify(res.data),
          'utf8',
          err => {
            if (err) throw err;
            console.log(
              `${start_date.toString()}-${end_date.toString()}-summaries.json file has been saved!`
            );
          }
        );
        console.log('---');
        console.warn('start => ', res.data.start);
        console.warn('end => ', res.data.end);
        console.log('---');
        console.log('res.status => ', res.status);
        console.log('date => ', res.headers.date);
        return 'success';
      })
      .catch(function(error) {
        console.error(error);
      });
  },
};
