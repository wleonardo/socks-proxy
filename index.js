const net = require('net');
const shakehand = require('./shake-hand.js');

function connectServer(socket) {
  socket.on('error', (e) => {
    console.log('出错啦');
    console.error(e);
  });
  socket.on('end', () => {
    // console.log(`socketNumber: ${socketNumber}`);
    console.log('client disconnected');
  });
  socket.once('data', shakehand.bind(socket));
}

function socksProxy(options) {
  net.createServer(connectServer).listen(options.port);
}

module.exports = socksProxy;
