// const http = require('http');
const app = require('./app');

const host = '0.0.0.0';

const port = process.env.PORT || 5000; // sets port and defaults to 5000

// const server = http.createServer(app);

// server.listen(port, host);

app.listen(port, host, function() {
    console.log("Server started.......");
});