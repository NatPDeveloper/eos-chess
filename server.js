const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3526; // sets port and defaults to 3000

const server = http.createServer(app);

server.listen(port);