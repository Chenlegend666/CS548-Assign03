const express = require('express');
const https = require('https');
const fs = require('fs');
const { studentInfo } = require('./routes/studentInfo');

const app = express();

const options = {
    key: fs.readFileSync('./ssl/key.key'),
    cert: fs.readFileSync('./ssl/cert.crt')
};

const server = https.createServer(options, app);
app.use(express.json());

app.use('/', studentInfo)

server.listen(8080, () => {
    console.log(`Server is up`)
});