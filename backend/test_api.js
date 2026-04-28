const http = require('http');

const data = JSON.stringify({
  message: 'Hello Nyaya AI'
});

const options = {
  hostname: 'localhost',
  port: 5003,
  path: '/api/v1/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
