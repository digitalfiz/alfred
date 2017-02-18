import apiai  from 'apiai';
import EventEmitter from 'events';

const app = apiai(process.env.APIAI_TOKEN);

export const callApiAi = (text, settings) => {
  const emitter = new EventEmitter();

  settings = Object.assign({
    sessionId: 'lololololololol'
  }, settings);

  const request = app.textRequest(text.trim(), settings);

  request.on('response', function(response) {
    emitter.emit('done', response.result);
  });

  request.on('error', function(error) {
    emitter.emit('error', error);
  });
  request.end();

  return emitter;
};
