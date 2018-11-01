const http = require('http');
const app = require('./app');

// const port = (process.env.PORT || 5000); // sets port and defaults to 5000

// const server = http.createServer(app);

// server.listen(port);

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
server.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});