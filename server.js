const http = require('http');
const app = require('./app');

// const port = (process.env.PORT || 5000); // sets port and defaults to 5000

// const server = http.createServer(app);

// server.listen(port);

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;
app.listen(PORT, HOST, function () {
    console.log(`Our app is running on port ${ PORT }`);
});