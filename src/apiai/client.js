const apiai = require('apiai');
const app = apiai(process.env.APIAI_TOKEN);

export const callApiAi = (text, callback) => {
  var request = app.textRequest(text.trim(), {
    sessionId: 'lololololololol'
  });
  request.on('response', function(response) {
    // syncSpeech(response.result.fulfillment.speech);
    callback(response.result);
  });

  request.on('error', function(error) {
    console.log(error);
  });
  request.end();
};
