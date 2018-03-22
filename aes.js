function encrypt(buffer) {
    var res = [];
    buffer.map((d) => {
        if (d == 255) {
            res.push(0);
        } else {
            res.push(d + 1);
        }
    });
    return new Buffer(res);
}

function decrypt(buffer) {
    var res = [];
    buffer.map((d) => {
        if (d == 0) {
            res.push(255);
        } else {
            res.push(d - 1);
        }
    });
    return new Buffer(res);
}

module.exports = {
    encrypt,
    decrypt
};
