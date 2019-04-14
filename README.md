# hacks

Run cron jobs using NodeJS

## Install

`npm install`

## Add `.env` variables

create an `.env` file:

```
PORT=1234
DOMAIN=http://localhost:1234
```

## Wakatime App

Create a new app [here](https://wakatime.com/apps/)

Copy `AppID` and `AppSecret` to .env

```
WAKATIME_APP_REDIRECT=http://localhost:1234/redirect
WAKATIME_CLIENT_ID=123456789
WAKATIME_CLIENT_SECRET=sec_123456789
```

Make sure you setup your Authorized Redirect URIs

## Slack Integration

Setup slack incomming webhook https://slack.com/apps/A0F7XDUAZ-incoming-webhooks

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/1234/1234
```

## Run

`npm start`
