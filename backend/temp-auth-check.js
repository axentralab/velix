const http = require('http');
const testEmail = `testuser+${Date.now()}@example.com`;
const password = 'TestPass123!';
const payload = JSON.stringify({ name: 'Test User', email: testEmail, password });
const registerOptions = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};
const request = (options, data) => new Promise((resolve, reject) => {
  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => resolve({ statusCode: res.statusCode, body }));
  });
  req.on('error', reject);
  req.write(data);
  req.end();
});
(async () => {
  try {
    const reg = await request(registerOptions, payload);
    console.log('REGISTER', reg.statusCode, reg.body);
    if (reg.statusCode === 200 || reg.statusCode === 201) {
      const loginPayload = JSON.stringify({ email: testEmail, password });
      const loginOptions = { ...registerOptions, path: '/api/auth/login', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) } };
      const login = await request(loginOptions, loginPayload);
      console.log('LOGIN', login.statusCode, login.body);
    }
  } catch (error) {
    console.error('ERROR', error.message);
  }
})();
