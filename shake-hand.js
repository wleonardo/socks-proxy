const passwordVerity = require('./password-verify.js');

const AuthMethods = {
  NOAUTH: 0,
  GSSAPI: 1,
  USERPASS: 2,
};

function shakehand(chunk) {
  let socket = this;
  const VERSION = parseInt(chunk[0], 10);
  // 客户端支持的认证方式的数量
  const NMETHODS = parseInt(chunk[1], 10);
  if (VERSION !== 5) {
    socket.destroyed || socket.destroy();
    return false;
  }

  socket.methods = [];
  for (let i = 1; i <= NMETHODS; i++) {
    socket.methods.push(chunk[1 + i]);
  }

  let isSupportPassrod = socket.methods.find(method => method === AuthMethods.USERPASS);
  console.log(isSupportPassrod);
  if (typeof isSupportPassrod === 'undefined') {
    let res = new Buffer([VERSION, 0xFF]);
    socket.write(res);
    socket.destroyed || socket.destroy();
    return false;
  }
  let res = new Buffer([VERSION, AuthMethods.USERPASS]);
  socket.write(res);
  socket.once('data', passwordVerity.bind(socket));
  return false;
}

module.exports = shakehand;
