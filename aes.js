const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';

function encrypt(buffer) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return crypted;
}

function decrypt(buffer) {
    // if (!Buffer.isBuffer(encrypted)) {
    //     console.error('encrypted is not buffer');
    //     return false;
    // }
    // console.log("encrypted");
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return dec;
}
//
// var a = encrypt(new Buffer([01, 02, 03]));
// console.log(a);
// console.log(decrypt(a));


module.exports = {
    encrypt,
    decrypt
};
