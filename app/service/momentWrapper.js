import moment from 'moment';

let mockedTime;

function get(time, format) {
  if (null === time) {
    time = undefined;
  }
  if (null === format) {
    format = undefined;
  }
  return moment.utc(time || mockedTime, format);
}

export default {
  raw: moment,
  get: get
};
