const net = require('net');
const ReqInfo = require('./reqinfo.js');
const log = require('./log.tool.js');

async function receiveRequest(chunk) {
  let socket = this;

  let reqinfo = await ReqInfo(chunk);

  let resp = new Buffer(chunk.length);
  chunk.copy(resp);
  resp[0] = 0x05;

  if (reqinfo.dest === '127.0.0.1' || reqinfo.dest === 'localhost') {
    resp[1] = 0x02;
    socket.write(resp);
    return false;
  }

  try {
    let req = net.createConnection(reqinfo.port, reqinfo.dest, (s) => {
      log('createConnection success');
      // 要在保证连接上目标服务器返回成功数据
      resp[1] = 0x00;
      log(resp);
      socket.write(resp);
      // 在客户端接受到连接上服务器的信息，则会发送完整的请求内容，直接转发给req
      socket.pipe(req);
      req.pipe(socket);
    });
    req.setTimeout(60 * 1000);
    req.on('timeout', () => {
      resp[1] = 0x06;
      socket.write(resp);
      req.destroyed || req.destroy();
    });
    req.on('error', () => {
      resp[1] = 0x05;
      socket.write(resp);
    });
  } catch (e) {
    console.error('未捕捉错误: net.createConnection');
    socket.emit('error', e);
  }
}

module.exports = receiveRequest;
