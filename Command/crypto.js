var crypto = require('crypto'), 
    alorithm = 'aes-256-ctr', 
    password = 'thisisnojoke@#!'

function decrypt(text) {
        var decipher = crypto.createDecipher(alorithm, password)
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8')
    return dec
}

exports.crypto = decrypt;

