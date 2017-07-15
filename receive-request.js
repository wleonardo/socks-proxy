const net = require('net');
const ReqInfo = require('./reqinfo.js');
const log = require('./log.tool.js');

async function receiveRequest(chunk) {
  let socket = this;

  let reqinfo = await ReqInfo(chunk);

  if (reqinfo.dest === '127.0.0.1' || reqinfo.dest === 'localhost') {
    socket.close();
    return false;
  }
  let resp = new Buffer(chunk.length);
  chunk.copy(resp);
  log(reqinfo);
  try {
    let req = net.createConnection(reqinfo.port, reqinfo.dest, (s) => {
      log('createConnection success');
      // 要在保证连接上目标服务器返回成功数据
      resp[0] = 0x05;
      resp[1] = 0x00;
      log(resp);
      socket.write(resp);
      // 在客户端接受到连接上服务器的信息，则会发送完整的请求内容，直接转发给req
      socket.pipe(req);
      req.pipe(socket);
    });
    req.setTimeout(60 * 1000);
    req.on('timeout', () => {
      console.error('req timeout');
      req.destroy();
      socket.close();
    });
    req.on('error', (e) => {
      socket.emit('error', e);
    });
  } catch (e) {
    console.error('未捕捉错误: net.createConnection');
    socket.emit('error', e);
  }
}

module.exports = receiveRequest;
