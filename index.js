const net = require('net');
const http = require('http');
const shakehand = require('./shake-hand.js');
var totalSocketNumber = 0;
var handleSockerNumber = 0;
var socketNumber = 0;
function connectServer(socket) {
  socketNumber++;
  totalSocketNumber++;
  try {
    socket.on('error', (e) => {
      console.error(e);
      socket.end();
    });
    socket.on('end', () => {
      handleSockerNumber++;
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
      handleSockerNumber,
      socketNumber
    });
    response.write(r);
    response.end();
  }).listen(++options.port);
}

module.exports = socksProxy;
