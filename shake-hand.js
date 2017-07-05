const receiveRequest = require('./receive-request.js');
const log = require('./log.tool.js');

const AuthMethods = {
  NOAUTH: 0,
  GSSAPI: 1,
  USERPASS: 2,
};

function shakehand(chunk) {
  let socket = this;
  const VERSION = parseInt(chunk[0], 10);
  const NMETHODS = parseInt(chunk[1], 10);
  log(chunk);
  if (VERSION !== 5) {
    log('socks version is not 5')
    socket.end('socks version is not 5');
    return false;
  }

  socket.methods = [];
  for (let i = 1; i <= NMETHODS; i++) {
    socket.methods.push(chunk[1 + i]);
  }

  let res = new Buffer([VERSION, AuthMethods.NOAUTH]);
  socket.write(res);
  socket.once('data', receiveRequest.bind(socket));
  return false;
}

module.exports = shakehand;
