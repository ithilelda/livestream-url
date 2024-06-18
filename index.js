const bilibili = require('./bilibili');
const douyu = require('./douyu');


module.exports = {
  bilibili,
  douyu,
};

douyu.get_h5_url(88660).then(console.log);