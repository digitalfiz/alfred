import express  from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { apiaiHandler } from './apiai';

const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

const app = express();
app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true; } }));


// Routes
app.use('/', express.static(path.join(__dirname, 'src/public'), { index: 'index.html' }));
app.post('/api/apiai', apiaiHandler);
app.get('/api/ping', (req, res) => res.send('PONG!'));


app.post('/api/action/athome', (req, res) => {
  console.log('/api/action/athome req.rawBody', req.rawBody);
});


// Lets start
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});


