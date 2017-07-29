const net = require('net');
const http = require('http');
const shakehand = require('./shake-hand.js');
var totalSocketNumber = 0;
var handleSocketNumber = 0;
var socketNumber = 0;
var errorSocketNumber = 0;
function connectServer(socket) {
  socketNumber++;
  totalSocketNumber++;
  try {
    socket.on('error', (e) => {
      console.error(e);
      errorSocketNumber++;
    });
    socket.setTimeout(60 * 1000);
    socket.on('timeout', () => {
      socket.destroyed || socket.destroy();
    });
    socket.on('close', () => {
      handleSocketNumber++;
      socketNumber--;
    });
    socket.once('data', shakehand.bind(socket));
  } catch (e) {
    console.error('未捕捉错误');
    console.error(e);
  }
}

function socksProxy(options) {
  net.createServer(connectServer).listen(options.port).on('error', (e) => {
    console.error(e);
  });
  http.createServer((request, response) => {
    response.writeHead(200, {
      'Content-Type': 'application/json'
    });
    var r = JSON.stringify({
      totalSocketNumber,
      handleSocketNumber,
      socketNumber,
      errorSocketNumber
    });
    response.write(r);
    response.end();
  }).listen(++options.port);
}

module.exports = socksProxy;
