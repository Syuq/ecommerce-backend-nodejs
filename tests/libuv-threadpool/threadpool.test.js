const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
require('dotenv').config();
const os = require('os');

// process.env.UV_THREADPOOL_SIZE = 8;

app.get('/api/health', async (req, res) => {
  const hasPassword = await bcrypt.hash('This is a password', 10);
  res.send({
    status: 'ok',
    message: 'Server is running',
    cpuCount: os.cpus().length,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    hasPassword
  });
});

app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');
});
