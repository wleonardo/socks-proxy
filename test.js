const dns = require('dns');

var ab = function (domainName) {
  return new Promise((resolve) => {
    dns.lookup(domainName, (err, addresses, family) => {
      resolve(addresses);
    });
  });
};
async function dnsToIp(domainName) {
  var a = await ab(domainName);
  console.log(a);
}

console.log(dnsToIp('baidu.com'));
