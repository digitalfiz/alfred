import { syncSpeech, playResource } from './speak';
import { makeTextRequest, setContext } from './apiai/client';
import Sonus from 'sonus';
import colors from './colors';
import { tts } from './google';

const logMessage = (message, color) => {
  console.log(color, message, colors.Reset);
};

var d = new Date();
var unixtime = d.getTime();
const SESSION_ID = new Buffer(`${unixtime}-${process.env.DEVICE_LOCATION}`).toString('base64');

const context = {
  name: 'input_location',
  parameters: {
    'location': process.env.DEVICE_LOCATION
  }
};
setContext([ context ], { sessionId: SESSION_ID });


String.prototype.cap = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

logMessage('Setting up hotwords', colors.FgYellow);
const hotwords = [{ file: 'resources/alfred.pmdl', hotword: 'alfred' }];

logMessage('Setting up sonus', colors.FgYellow);
const sonus = Sonus.init({ hotwords, language: 'en-US' }, tts);

sonus.on('hotword', (index, keyword) => {
  logMessage(`Alfred: Got hotword ${keyword}`, colors.FgGreen + colors.Bright);
  playResource('triggered');
});

sonus.on('error', (err) => {
  console.error('err', err);
  playResource('error');
});

sonus.on('final-result', (text) => {
  if (text.length > 0) {
    logMessage('   You: ' + text.cap(), colors.FgMagenta);

    const call = makeTextRequest(text, { sessionId: SESSION_ID });

    call.on('done', (res) => {
      logMessage('Alfred: ' + res.fulfillment.speech, colors.FgBlue);
      if (res.action == 'input.unknown') {
        playResource('error');
      } else if (res.action == 'red_alert') {
        playResource('automaticdefenseproceduresinitiated');
      } else {
        syncSpeech(res.fulfillment.speech);
      }
    });
  } else {
    console.log('Didn\'t hear anything');
  }
});

logMessage('Say "' + hotwords[0].hotword + '"...', colors.FgYellow + colors.Bright);
Sonus.start(sonus);
