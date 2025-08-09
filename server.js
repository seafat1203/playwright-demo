const express = require('express');
const { spawn } = require('child_process');

const app = express();
const TOKEN = process.env.RUN_TOKEN;

app.get('/', (_req, res) => res.send('OK'));

app.post('/run', (req, res) => {
  const auth = req.headers.authorization || '';
  if (!TOKEN || auth !== `Bearer ${TOKEN}`) return res.status(401).send('Unauthorized');

  const child = spawn('npm', ['run', 'test:ssn'], { stdio: 'inherit' });
  child.on('close', code => console.log('Playwright exit code:', code));
  res.status(202).send('Started');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening on', port));
