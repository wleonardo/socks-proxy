const dns = require('dns');

const TypeList = {
  IPv4: 0x01,
  DomainName: 0x03,
  IPv6: 0x04,
};

const log = require('./log.tool.js');

function getPort(chunk) {
  return chunk.readUIntBE(chunk.length - 2, 2).toString(10);
}

function dnsToIp(domainName) {
  return new Promise((resolve) => {
    dns.lookup(domainName, (err, addresses, family) => {
      resolve(addresses);
    });
  });
}

module.exports = async function (chunk) {
  let reqinfo = {
    dest: '',
  };
  const type = chunk[3];
  if (type === TypeList.IPv4) {
    let ipBuffer = chunk.slice(4, 8);
    reqinfo.port = getPort(chunk);
    for (let i = 0; i < ipBuffer.length; i++) {
      reqinfo.dest += `.${ipBuffer[i].toString(10)}`;
    }
    reqinfo.dest = reqinfo.dest.slice(1);
  } else if (type === TypeList.DomainName) {
    log('DomainName');
    var domainName = chunk.slice(5, -2).toString('utf8').replace('\r', '');
    let ip = await dnsToIp(domainName);
    reqinfo.dest = ip;
    reqinfo.port = getPort(chunk);
  } else if (type === TypeList.IPv6) {
    log('IPv6');
    let ipBuffer = chunk.slice(4, -2);
    let dest = '';
    for (let i = 0; i < ipBuffer.length; i += 2) {
      dest += `:${ipBuffer.slice(i, i + 2).toString('hex')}`;
    }
    reqinfo.dest = dest.slice(1);
  }
  return reqinfo;
};
