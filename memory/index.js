const fork = require('child_process').fork;
const Memory = require('./memory');

var singleton;

function Index(options) {
  if (!singleton) {
    const child = fork(`${__dirname}/memory.js`);
    singleton = new Memory(child, options);
  }
  return singleton;
}

module.exports = Index;
