import hangoutsBot from 'hangouts-bot';
import apiai from 'apiai';
import uuidV1 from 'uuid/v1';

const HANGOUTS_EMAIL = process.env.HANGOUTS_EMAIL;
const HANGOUTS_PASSWORD = process.env.HANGOUTS_PASSWORD;
const APIAI_TOKEN = process.env.APIAI_TOKEN;

const bot = new hangoutsBot(HANGOUTS_EMAIL, HANGOUTS_PASSWORD);
const app = apiai(APIAI_TOKEN, {language: 'en', requestSource: 'hangouts'});
 
bot.on('online', () => {
  console.log(`bot logged in as ${HANGOUTS_EMAIL}`);
});

var sessionIds = new Map();

bot.on('message', (from, message) => {
  let sender = from.split('/')[0];
  console.log(sender + ' >> ' + message);

  // Setup a session id if there isn't one
  if (!sessionIds.has(sender)) {
    sessionIds.set(sender, uuidV1());
  }

  let request = app.textRequest(message, {
    sessionId: sessionIds.get(sender),
    originalRequest: {
      source: 'hangouts',
      data: {
        sender: {
          id: sender
        }
      }
    }
  });
  request.on('response', (response) => {
    bot.sendMessage(from, response.result.fulfillment.speech);
  });
  request.on('error', (error) => {
    console.log('apiai error', error);
  });
  request.end();
});
