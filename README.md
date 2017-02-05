# ALFred

This is some code that I put together that creates your own Alexa or Google Assistant.

## Technology used

* [Snowboy](https://github.com/Kitt-AI/snowboy)/[Sonus](https://github.com/evancohen/sonus) for hotwork detection.
* [Google Speech Engine](https://cloud.google.com/speech/) for speech to text.
* [api.ai](https://api.ai/) for the language understanding.
* Nodejs for the api.ai fullfilment server and the scripts to listen for voice and the chat script.


## Disclaimer
This code is very messy right now and it may or may not run for you as I probably have forgotten many things I did to get different parts working. I plan to do a fresh start on it soon after I clean up the code so I can make sure I get everything that needs to be done.

## Prereqs

The scripts all make a few assumptions:

* You have an api.ai agent setup to at least respond to some basic queries (I will be posting mine when I am more comfortable with it).
* You have your local aws creds setup [properly](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).
* You have generated a [secrets file](https://github.com/GoogleCloudPlatform/google-cloud-node#elsewhere) from your google cloud account.
* You have [node](https://nodejs.org) > 4.x and [yarn](https://yarnpkg.com/) installed.


Installing nodejs dependancies:
```sh
yarn install
```

## Running some of the scripts I am working on

To run the hotword detection with voice response (basically the alexa,assistant part) run:
```sh
GOOGLE_CLOUD_PROJECT_ID=someproject GOOGLE_CLOUD_EMAIL=my@email.com GOOGLE_CLOUD_SECRETS_FILE=/path/to/secrets/file APIAI_TOKEN=sometoken node listen.js
```

To run the hangouts bot, for chatting with the bot on hangouts:
```sh
HANGOUTS_EMAIL=my@email.com HANGOUTS_PASSWORD=mypassword APIAI_TOKEN=sometoken node hangouts_bot.js
```

To run a local chat box 
```sh
APIAI_TOKEN=sometoken node chat.js
```

All of the above commands will try to query api.ai for your agent and get a response to give you.

## api.ai fullfillment

If you want to run a server that api.ai can connect to and do some extra stuff like chuck norris jokes and a few things with the nest thermostat I have been working on a express.js server for it.

There are quite a few envinronment variables you need to set to run the server. I haven't gathered them all so you may want to look through the code for `process.env.` to find them all. You can run the server like so:

```sh
node server.js
```
You may want to look through the code in `src/apiai/index.js` for the actions I've been building and working on.

