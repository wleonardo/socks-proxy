const EventEmitter = require('events');

function Memory(mprocess) {
  // console.log(this);
  // if (!(this instanceof Memory)) {
  //   throw new Error('use new to create memory');
  //   return false;
  // }
  // if (singleton) {
  //   return singleton;
  // }
  // this.init();
}

// Memory.prototype.init = function () {
//   console.log(this);
//   this.fork();
// };
//
// Memory.prototype.fork = function () {
//   let childProcess = fork(__filename);
//   console.log(childProcess);
// };

module.exports = Memory;
