// DEMO ONLY: deliberately insecure sample for scanner testing.
// Nothing here is executed: no server is started and no function is called.
const express = require('express');
const crypto = require('crypto');
const https = require('https');
const { exec } = require('child_process');

const router = express.Router();

// 1. Command injection pattern: request data flows into a shell command
router.get('/ping', (req, res) => {
  exec('ping -c 1 ' + req.query.host, (err, out) => res.send(out));
});

// 2. Reflected XSS pattern: request data is written into HTML unescaped
router.get('/hello', (req, res) => {
  res.send('<h1>Hello ' + req.query.name + '</h1>');
});

// 3. Weak hashing: MD5 for a password
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// 4. Predictable token from a non-cryptographic random generator
function makeToken() {
  return Math.random().toString(36).slice(2);
}

// 5. TLS certificate validation turned off
function insecureRequest() {
  return https.request({ host: 'example.com', rejectUnauthorized: false });
}

// 6. Hardcoded credential (fake value)
const API_KEY = 'demo-not-a-real-key-1234567890';

module.exports = { router, hashPassword, makeToken, insecureRequest, API_KEY };
