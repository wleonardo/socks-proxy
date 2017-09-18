const AuthMethods = {
  0: 'NOAUTH',
  1: 'GSSAPI',
  2: 'USERPASS',
};

function shakehandData(data) {
  const methodNumber = parseInt(data[1], 10);

  let methods = [];
  for (let i = 1; i <= methodNumber; i++) {
    methods.push(AuthMethods[data[1 + i]]);
  }

  return Object.assign(this, {
    // socks 版本号
    version: parseInt(data[0], 10),
    // 客户端支持的认证方式的数量
    methodNumber,
    // 客户端支持的认证方式
    methods
  });
}

shakehandData.prototype.isSupportPassrod = function () {
  return !!this.methods.find(method => method === AuthMethods['2']);
};

module.exports = shakehandData;
