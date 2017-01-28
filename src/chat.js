import readline from 'readline';
import apiai from 'apiai';
import { syncSpeech }  from './speak';

const app = apiai(process.env.APIAI_TOKEN);
const prefix_you = ' alfred>  ';
const prefix_him = 'alfred# ';
const greeting = 'Hello! How may I help you today?';

const log = {
  reset: '\x1b[0m',
  bot: function(text) {
    console.log('\x1b[35m', prefix_him, text, this.reset);
  },
  client: function(text) {
    console.log('\x1b[2m', prefix_you, text, this.reset);
  }
};


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function(line) {

  if (line.trim() == '') {
    return;
  }

  var request = app.textRequest(line.trim(), {
    sessionId: '<unique session id>'
  });

  request.on('response', function(response) {
    syncSpeech(response.result.fulfillment.speech);
    log.bot(response.result.fulfillment.speech);
    rl.setPrompt(prefix_you, prefix_you.length);
    rl.prompt();
  });
  request.on('error', function(error) {
    console.log(error);
  });
  request.end();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});


syncSpeech(greeting);
log.bot(greeting);
rl.setPrompt(prefix_you, prefix_you.length);
rl.prompt();

