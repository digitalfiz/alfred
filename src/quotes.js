import { parseString } from 'xml2js';
import request from 'request';

const USER_ID = process.env.STANDS4_USER_ID;
const TOKEN = process.env.STANDS4_TOKEN;

export const getQuote = (author, callback) => {
  let apiUrl = `http://www.stands4.com/services/v2/quotes.php?uid=${USER_ID}&tokenid=${TOKEN}&searchtype=RANDOM`;
  if (author.length > 0) {
    author = encodeURIComponent(author);
    apiUrl = `http://www.stands4.com/services/v2/quotes.php?uid=${USER_ID}&tokenid=${TOKEN}&searchtype=AUTHOR&query=${author}`;
  }
  return request(apiUrl, (error, response, body) => {
    parseString(body, (err, result) => {
      const quote = result.results.result[0];
      callback({ quote: quote.quote[0], author: quote.author[0] }, err);
    });
  });
};
