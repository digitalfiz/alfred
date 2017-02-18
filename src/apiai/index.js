import fs from 'fs';
import { getChuckJoke, getRandomJoke } from '../jokes';
import { getQuote } from '../quotes';
import { getStatus } from '../github';
import { getTemperature, setTemperature } from '../nest';


// @todo this will be a database eventually?
const ADMINS = {
  hangouts: [
    'my@email.com',
    'another.family.member@email.com'
  ]
};

export const PAYLOAD = {
  'speech': '',
  'displayText': '',
  'data': null,
  'contextOut': null,
  'source': 'icndb'
};

const checkAccess = (originalRequest) => {
  console.log('checking ', originalRequest);
  const source = originalRequest.source;
  const sender = originalRequest.data.sender.id;
  if (ADMINS.hasOwnProperty(source) && ADMINS[source].indexOf(sender) >= 0) {
    return true;
  }
  return false;
};

const answerApi = (res, text, extra) => {
  let payload = Object.assign(PAYLOAD, { 
    speech: text,
    displayText: text
  });

  if (extra) {
    payload = Object.assign(payload, extra);
  }

  return res.send(payload);
};


export const apiaiHandler = (req, res) => {
  const json = JSON.parse(req.rawBody);
  const intent = json.result.metadata.intentName;
  const action = json.result.action;
  let text = '';

  console.log(JSON.stringify(json.result, null, '  '));

  if (action == 'input_location') {
    let location = null;

    for (let context in json.result.contexts) {
      if (context.name === 'location') {
        location = context.parameters.location;
      }
    }
    
    if (location) {
      return answerApi(res, `The location of the device you are using is '${location}'.`);
    } else {
      return answerApi(res, 'I am sorry the device you are using didn\'t provide a location.');
    }

  }

  if (action === 'input.unknown') {
    return console.log('json', json);
  }

  if (action === 'simon_says') {
    return answerApi(res, json.result.parameters.phrase);
  }

  if (action === 'adjust_temperature') {
    let feels = json.result.parameters.feels;

    if (feels === 'hot') {
      return answerApi(res, 'Turning the thermostat down a few degrees');
    }

    if (feels === 'cold') {
      return answerApi(res, 'Turning the thermostat up a few degrees');
    }
  }

  if (action === 'get_house_temp') {
    const temp = getTemperature();
    return temp.on('done', (temperature) => {
      return answerApi(res, `The current temperature in the house is ${temperature} degrees`);
    });
  }

  if (action === 'set_temperature') {
    if (json.originalRequest && checkAccess(json.originalRequest)) {
      let temp = json.result.parameters.temperature;
      let location = json.result.parameters.location;
      setTemperature(temp);
      text = `You got it! Setting the temperature in ${location} to ${temp} degrees`;
    } else {
      text = 'I\'m sorry you do not have access to this feature.';
    }

    return answerApi(res, text);
  }

  if (action === 'get_chuck_norris_jokes') {
    return getChuckJoke((joke, error) => {
      if (!error) {
        return answerApi(res, joke);
      }
    });
  }

  if (action === 'get_random_jokes') {
    return getRandomJoke((joke, error) => {
      if (!error) {
        return answerApi(res, joke);
      }
    });
  }

  if (action === 'get_quote') {
    return getQuote(json.result.parameters.author, (quote, error) => {
      if (!error) {
        return answerApi(res, `${quote.quote} -- ${quote.author}`);
      }
    });
  }

  if (action === 'get_github_status') {
    return getStatus((status, error) => {
      if (!error) {
        return answerApi(res, status);
      }
    });
  }


  // Defualt response
  return;

};
