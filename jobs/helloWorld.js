const nestedTest = require('./helloWorld/nest.js');
const slackNotify = require('../helpers/slack');

module.exports = {
  main: function() {
    console.log('run helloWorld.js webhook');
    slackNotify.main('hello-world', 'helloWorld.js webhook');
    nestedTest.main();
  },
};
