const EventEmitter = require('events');
const server = require('./server.js');

const shakehandDataGen = require('./shake-hand-data.js');
const ReqInfo = require('./reqinfo.js');

class proxy extends EventEmitter {
    constructor(options = {}, statistics = {}) {
        super();
        this.options = Object.create(options);
        this.statistics = Object.create(statistics);
    }
    listen(port) {
        this.server = new server();
        this.server.on('shakehand', this.shakehand);
        this.server.on('receiveRequest', this.receiveRequest);
        this.server.listen(port);
    }
    shakehand(connect, data) {
        const [server, socket] = [connect.server, connect.socket];
        const shakehandData = new shakehandDataGen(data);

        if (shakehandData.version !== 5) {
            connect.server.emit('destroyConnect', connect)
            return false;
        }

        if (shakehandData.isSupportPassrod()) {
            // todo
        } else {
            const res = new Buffer([shakehandData.version, 0]);
            connect.server.emit('sendShakeHandDate', res);
        }
        return true;
    }
    async receiveRequest(connect, data) {
        const [server, socket] = [connect.server, connect.socket];
        const reqinfo = new ReqInfo(data);
        if (reqinfo.type === 3) {
            await reqinfo.dnsToIp();
        }

        if (!reqinfo.valid()) {
            return connect.server.emit('destroyConnect', connect)
        }

        let resp = new Buffer(data.length);
        data.copy(resp);

        //  现有的规则不允许的连接
        if (reqinfo.dest === '127.0.0.1' || reqinfo.dest === 'localhost') {
            resp[1] = 0x02;
            connect.socket.sendData(resp);
            return false;
        }

    }
}
module.exports = proxy;
