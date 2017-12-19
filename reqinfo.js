const dns = require('dns');
const TypeList = {
  IPv4: 0x01,
  DomainName: 0x03,
  IPv6: 0x04,
};

const reqinfoData = {
  type: '',
  dest: '',
  port: 80
};

function dnsToIp(domain) {
  return new Promise(function(resolve, reject) {
    dns.lookup(domain, (err, address, family) => {
      resolve(address);
      console.log('address: %j family: IPv%s', address, family);
    });
  });
}

function getPort(data) {
  return data.readUIntBE(data.length - 2, 2).toString(10);
}

module.exports = class Reqinfo {
  constructor(data) {
    Object.assign(this, reqinfoData);
    this.init(data);
  }
  init(data) {
    // if (data.length < 4) {
    //   return false;
    // }
    const type = this.type = data[3];
    this.port = getPort(data);
    if (type === TypeList.IPv4) {
      const ipBuffer = data.slice(4, 8);
      for (let i = 0; i < ipBuffer.length; i++) {
        this.dest += `.${ipBuffer[i].toString(10)}`;
      }
      this.dest = this.dest.replace(/ /g, '').slice(1);
    } else if (type === TypeList.DomainName) {
      this.dest = data.slice(5, -2).toString('utf8').replace('\r', '');
    } else if (type === TypeList.IPv6) {
      const ipBuffer = data.slice(4, -2);
      for (let i = 0; i < ipBuffer.length; i += 2) {
        this.dest += `:${ipBuffer.slice(i, i + 2).toString('hex')}`;
      }
      this.dest = this.dest.replace(/ /g, '').slice(1);
    }
  }
  async dnsToIp() {
    this.dest = await dnsToIp(this.dest);
  }
  valid() {
    return this.type && this.port && this.dest;
  }
};
