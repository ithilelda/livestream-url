const bilibili = require('./bilibili');


module.exports = {
  bilibili,
};

bilibili.get_live_urls(111).then(console.log);