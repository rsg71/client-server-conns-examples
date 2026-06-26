const express = require('express');
const { dir } = require('node:console');
const path = require('node:path');
const app = express();

// Store pending requests waiting for data
let waitingClients = [];

const PORT = 3015;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

// Simulate data arriving every 5 seconds
setInterval(() => {
  const data = { value: Math.random(), time: Date.now() };
  
  // Respond to all waiting clients and clear the list
  waitingClients.forEach(res => res.json(data));
  waitingClients = [];
}, 5000);

app.get('/poll', (req, res) => {
  // Hold the request open by just not responding yet
  waitingClients.push(res);

  // If client disconnects before data arrives, remove them
  req.on('close', () => {
    waitingClients = waitingClients.filter(r => r !== res);
  });
});

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
});