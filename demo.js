const socksProxy = require('./index.js');

new socksProxy({
  memory: {
    interval: 5000
  }
}).listen(1091);
