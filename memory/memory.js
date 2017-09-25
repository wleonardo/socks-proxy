const EventEmitter = require('events');

class Memory extends EventEmitter {
  constructor(mprocess, options) {
    super();
    this.mprocess = mprocess;
    this.options = options;
    this.watch();
  }
  watch() {
    setInterval(() => {
      const data = this.getMemoryData();
      this.emit('data', data);
    }, this.options.interval);
  }
  getMemoryData() {
    return process.memoryUsage();
  }
}

module.exports = Memory;
