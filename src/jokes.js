import request from 'request';

export const getChuckJoke = (callback) => {
  return request('https://api.icndb.com/jokes/random', (error, response, body) => {
    let joke = null;
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      joke = body.value.joke;
    }
    callback(joke, error);
  });
};

export const getRandomJoke = (callback) => {
  return request('http://tambal.azurewebsites.net/joke/random', (error, response, body) => {
    let joke = null;
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      joke = body.joke;
    }
    callback(joke, error);
  });
};
