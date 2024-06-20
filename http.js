const https = require('https');
const fs = require('fs');


const options = {
    key : fs.readFileSync('certificates/key.pem'),
    cert : fs.readFileSync('certificates/cert.pem')

}

https.createServer( options , ( req , res )=>{
    res.end("SSL Added!");
}).listen(PORT)