// const crypto = require('crypto');
// const algorithm = 'aes-256-ctr';
// const password = 'd6F3Efeq';
//
// function encrypt(buffer) {
//     var cipher = crypto.createCipher(algorithm, password)
//     var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
//     return crypted;
// }
//
// function decrypt(buffer) {
//     if (!Buffer.isBuffer(buffer)) {
//         console.error('encrypted is not buffer');
//         return false;
//     }
//     // console.log("encrypted");
//     var decipher = crypto.createDecipher(algorithm, password)
//     var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
//     return dec;
// }
// //
// // var a = encrypt(new Buffer([01, 02, 03]));
// // console.log(a);
// // console.log(decrypt(a));
//
//
// module.exports = {
//     encrypt,
//     decrypt
// };
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';

function encrypt(buffer) {
    var res = [];
    buffer.map((d) => {
        res.unshift(d);
    });
    return new Buffer(res);
    // var cipher = crypto.createCipher(algorithm, password)
    // var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    // return crypted;
}

function decrypt(buffer) {
    var res = [];
    buffer.map((d) => {
        res.unshift(d);
    });
    return new Buffer(res);
    // if (!Buffer.isBuffer(buffer)) {
    //     console.error('buffer is not buffer');
    //     return false;
    //
    // }
    // var decipher = crypto.createDecipher(algorithm, password)
    // var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
    // return dec;
}
// var a = new Buffer([01, 02, 03]);
// var b = [];
// a.map((d) => {
//     console.log(d);
//     b.push(d + 1);
// });
// console.log();
// console.log(a);
// console.log(decrypt(a));


module.exports = {
    encrypt,
    decrypt
};
