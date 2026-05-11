const https = require('https');
const data = JSON.stringify({ name: 'Test User', email: 'testuser_api@example.com', password: 'TestPassword123!' });
const options = {
  hostname: 'velix.onrender.com',
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};
const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('HEADERS', JSON.stringify(res.headers));
    console.log('BODY', body);
  });
});
req.on('error', (e) => console.error('ERROR', e.message));
req.write(data);
req.end();
