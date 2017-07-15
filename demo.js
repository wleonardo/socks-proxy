const socksProxy = require('./index.js');
const memoryLog = require('./memory-log.js');
socksProxy({
  port: 1091,
});
memoryLog(`${__dirname}/log/`, 60 * 1000);
