import crypto from 'crypto';
import { spawn } from 'child_process';
import AWS from 'aws-sdk';
import fs from 'fs';

// Create an Polly client
const Polly = new AWS.Polly({ region: 'us-east-1' });


export const playResource = (resource, dir='./resources') => {
  // automaticdefenseproceduresinitiated.mp3
  spawn('afplay', [`${dir}/${resource}.mp3`]);
};

export const playError = () => {
  playResource('error');
};

export const syncSpeech = (text, cacheDir) => {

  if(!cacheDir) {
    cacheDir = './cache';
  }

  var params = {
    OutputFormat: 'mp3', /* required */
    Text: text, /* required */
    VoiceId: 'Brian', /* required */
    SampleRate: '22050',
    TextType: 'text'
  };

  let md5sum = crypto.createHash('md5');
  md5sum.update(text);
  let fileMd5 = md5sum.digest('hex');

  if (!fs.existsSync(`${cacheDir}/${fileMd5}.mp3`)) {
    Polly.synthesizeSpeech(params, function(err, data) {
      if (err) {
        console.log('err', err, err.stack); // an error occurred
      } else {
        if (data.AudioStream instanceof Buffer) {
          fs.writeFile(`${cacheDir}/${fileMd5}.mp3`, data.AudioStream, function(err) {
            if (err) {
              return console.log(err);
            }
            // spawn('afplay', [`${cacheDir}/${fileMd5}.mp3`]);
            playResource(fileMd5, cacheDir);
          });
        }
      }
    });

  } else {
    // spawn('afplay', [`${cacheDir}/${fileMd5}.mp3`]);
    playResource(fileMd5, cacheDir);
  }
};
