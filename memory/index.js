const fork = require('child_process').fork;
var singleton;

function Memory() {
  console.log('123456');
  if (singleton) {

  } else {
    const child = fork(`${__dirname}/memory.js`);
    console.log(child);
    console.log(`fork return pid: ${child.pid}`);
  }
}

module.exports = Memory;
