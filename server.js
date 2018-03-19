const EventEmitter = require('events');
const net = require('net');
const dns = require('dns');
const statistics = require('./statistics');
const shakehandDataGen = require('./shake-hand-data.js');
const ReqInfo = require('./reqinfo.js');
const Connect = require('./connect.js');
const aes = require('./aes.js');

net.Socket.prototype.sendData = function(data) {
    data = aes.encrypt(data);
    this.write(data);
}



class socksProxy extends EventEmitter {
    constructor(options) {
        super();
        this.options = Object.create(options || {});
        this.statistics = Object.create(statistics);
    }
    /**
     * [listen 监听端口]
     * @param  {[type]} port [端口]
     */
    listen(port) {
        const server = this;
        net.createServer(server.connectServer.bind(server)).listen(port).on('error', (e) => {
            console.error(e);
        });
        /**
         * [监听所有主动emit的错误]
         */
        server.on('error', (e) => {
            console.error(e);
        });
    }
    /**
     * [connectServer 客户端的一次socket请求的处理]
     * @param  {[type]} socket [客户端的一次socket请求]
     * @return {[type]}        [description]
     */
    connectServer(socket) {
        const server = this;
        socket.on('data', (data) => {
            data = aes.decrypt(data);
            socket.emit('package', data);
        });
        /**
         * [connect 存储一次连接的内容]
         */
        const connect = Object.create(Connect);
        connect.socket = socket;
        connect.server = server;
        server.statistics.add('socketNumber');
        server.statistics.add('totalSocketNumber');
        try {
            socket.on('error', (e) => {
                console.error(e);
                server.statistics.add('errorSocketNumber');
            });
            socket.setTimeout(60 * 1000);
            socket.on('timeout', () => {
                socksProxy.destroyConnect(socket);
            });
            socket.on('close', () => {
                server.statistics.add('handleSocketNumber');
                server.statistics.reduce('socketNumber');
            });
            socket.once('package', server.shakehand.bind(connect));
        } catch (e) {
            console.error('未捕捉错误');
            server.emit('error', e);
        }
    }
    static destroyConnect(socket) {
        socket.destroyed || socket.destroy();
        return false;
    }
    shakehand(data) {
        const connect = this;
        const [server, socket] = [connect.server, connect.socket];
        const shakehandData = new shakehandDataGen(data);
        if (shakehandData.version !== 5) {
            return socksProxy.destroyConnect(socket);
        }
        if (shakehandData.isSupportPassrod()) {
            // todo
        } else {
            const res = new Buffer([shakehandData.version, 0]);
            socket.sendData(res);
            socket.once('package', server.receiveRequest.bind(connect));
        }
        return true;
    }
    async receiveRequest(data) {
        const connect = this;
        const [server, socket] = [connect.server, connect.socket];
        const reqinfo = new ReqInfo(data);

        if (reqinfo.type === 3) {
            await reqinfo.dnsToIp();
        }

        if (!reqinfo.valid()) {
            return socksProxy.destroyConnect(socket);
        }

        let resp = new Buffer(data.length);
        data.copy(resp);
        //  现有的规则不允许的连接
        if (reqinfo.dest === '127.0.0.1' || reqinfo.dest === 'localhost') {
            resp[1] = 0x02;
            socket.sendData(resp);
            return false;
        }
        try {
            const req = net.createConnection(reqinfo.port, reqinfo.dest, (s) => {
                // 要在保证连接上目标服务器返回成功数据
                resp[1] = 0x00;
                socket.sendData(resp);
                // 在客户端接受到连接上服务器的信息，则会发送完整的请求内容，直接转发给req
                socket.on('package', (data) => {
                    req.write(data);
                });
                req.on('data', (data) => {
                    socket.sendData(data);
                });
            });
            req.setTimeout(30 * 1000);
            req.on('timeout', () => {
                resp[1] = 0x06;
                socket.sendData(resp);
                socksProxy.destroyConnect(req);
            });
            req.on('error', () => {
                resp[1] = 0x05;
                socket.sendData(resp);
            });
        } catch (e) {
            console.error('未捕捉错误: net.createConnection');
            server.emit('error', e);
        }
        return true;
    }
}

module.exports = socksProxy;
