'use strict';

// const crypto = require('crypto');
// const ENCRYPTION_KEY = 'thisisnojoke@#!'; // Must be 256 bits (32 characters)
// const IV_LENGTH = 16; // For AES, this is always 16

// var text = '08FmGEJSNQuqbCtyP17mUBP70aDlDlOnSZKBnxAgsYi/gir7kKZgtGYxnfd/b+Bn'
// let textParts = text.split(':');
// let iv = Buffer.from(textParts.shift(), 'hex');
// let encryptedText = Buffer.from(textParts.join(':'), 'hex');
// let decipher = crypto.createDecipheriv('aes-128-cbc', ENCRYPTION_KEY, iv);
// let decrypted = decipher.update(text);

// decrypted = Buffer.concat([decrypted, decipher.final()]);

// console.log(decrypted.toString());

// {'\\?\D:\Electron\app2\node_modules\ref\build\Release\binding.node'
// was compiled against a different Node.js version using
// npm. This version of Node.js requires
// NODE_MODULE_VERSION 73. Please try re-compiling or re-installing
// the module (for instance, using `npm rebuild` or `npm install`)}
// var lib = ffi.Library('Project1.dll', {
//     AESDecrypt: ['string', ['string']]
// })
// for (var i=0; i<5000000; i++) {
//     lib.AESDecrypt("08FmGEJSNQuqbCtyP17mUBP70aDlDlOnSZKBnxAgsYi/gir7kKZgtGYxnfd/b+Bn")
// }

const https = require('https')

const data = JSON.stringify({
    path: 'C:\\Users\\isabekov\\Desktop\\errorlog\\2019-03-05_Ticket.log'
  })

var options = {
    host: 'localhost', 
    port: 44359, 
    path:'/api/values', 
    "rejectUnauthorized": false,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
}
const req = https.request(options, (res)=>{

    res.on('data', (d)=>{
        process.stdout.write(d)
    })
})

req.on('error', (error) => {
    console.error(error)
})
  
req.write(data)
req.end()

// https.get(options, (resp)=>{
//     let data = '';

//     resp.on('data', (chunk)=>{
//         data += chunk
//     })

//     resp.on('end', ()=>{
//         console.log(JSON.parse(data).explanation)
//     })
// }).on('error', (err)=>{
//     console.log(err.message)
// })

document.getElementById('load').addEventListener('click', ()=>{    



})