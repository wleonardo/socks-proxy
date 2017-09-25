const socksProxy = require('./index.js');
// const Memory = require('./memory/index.js');

new socksProxy().listen(1091);

// const memory = new Memory({
//   interval: 5000
// });

// memory.on('data', (data) => {
//   console.log(data);
//   logger(data);
// });

// setInterval(() => {
//   console.log(process.memoryUsage());
// }, 1000);
