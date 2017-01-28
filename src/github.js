import request from 'request';

const responses = {
  good: [
    'Seems to be all good in the hood.',
    'Systems operating normally according to the status page.',
    'Status page says all is good.',
    'Systems are nominal.'
  ],
  minor: [
    'There seems to be a minor outage',
    'Things are a bit our of sorts it would seem.',
    'Might have a flat tire :(',
  ],
  major: [
    'Somebody must have unplugged a few servers becuase things are all messed up.',
    'There seems to be a major outage currently.',
    'Run for the hills! It\'s all messed up!'
  ],
  unknown: 'We got an unknown response from githubs status page.'
};



export const getStatus = (callback) => {
  return request('https://status.github.com/api/status.json', (error, response, body) => {
    let status = null;
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);

      if (responses.hasOwnProperty(body.status)) {
        let rand = Math.floor(Math.random() * responses[body.status].length-1) + 1;
        status = responses[body.status][rand];
      } else {
        status = responses.unknown;
      }
    }
    callback(status, error);
  });
};
