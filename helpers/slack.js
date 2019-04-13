const axios = require('axios');

/*
slack webhook helper

params:
  webhook_name: will appear as user who sent slack message
  message: plain text message
  emoji: emoji to be used as user profile

*/
module.exports = {
  main: function(webhook_name, message, emoji) {
    axios({
      method: 'POST',
      url: process.env.SLACK_WEBHOOK_URL,
      data: {
        text: `${message}`,
        username: `${webhook_name}`,
        icon_emoji: `${emoji ? emoji : ':ghost:'}`,
      },
    }).then(function(res) {
      // expects 'ok' as res.data
      console.log(res.data);
    });
  },
};
