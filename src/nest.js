// import NestApi from 'nest-api';
import nest from './unofficial-nest-api';
import EventEmitter from 'events';

const USERNAME = process.env.NEST_USERNAME;
const PASSWORD = process.env.NEST_PASSWORD;
const DEVICE_ID = process.env.NEST_DEVICE_ID;

export const getTemperature = () => {
  const emitter = new EventEmitter();
  nest.login(USERNAME, PASSWORD, () => {
    nest.fetchStatus((data)=>{
      let tmp = nest.ctof(data.shared[DEVICE_ID].current_temperature);
      emitter.emit('done', tmp);
    });
  });
  return emitter;
};

export const setTemperature = (temp) => {
  const emitter = new EventEmitter();
  nest.login(USERNAME, PASSWORD, () => {
    console.log('logged in');
    nest.fetchStatus((data)=>{
      console.log('got initial status');
      let high = nest.ftoc(temp);
      let low = data.shared[DEVICE_ID].target_temperature_low;
      nest.setTemperatureRange(DEVICE_ID, low, high);
      emitter.emit('done');
    });
  });
  return emitter;
};
