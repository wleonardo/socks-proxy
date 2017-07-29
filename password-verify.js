const receiveRequest = require('./receive-request.js');

/**
 * Username/Password Authentication for SOCKS V5
 * https://tools.ietf.org/html/rfc1929
 */
module.exports = function (data) {
  const socket = this;
  let ver = data[0];
  let ulen = parseInt(data[1], 10);
  let username = data.slice(2, 2 + ulen).toString('utf8');

  let plen = parseInt(data[1 + ulen + 1], 10);
  let passwordStartPostion = 1 + ulen + 2;

  let password = data.slice(passwordStartPostion, passwordStartPostion + plen).toString('utf8');
  // status不是0x00就表示密码错误
  let status = 0x01;
  if (username === 'abc' && password === '1234') {
    status = 0x00;
  }
  let res = new Buffer([ver, status]);
  socket.write(res);
  socket.once('data', receiveRequest.bind(socket));
};
