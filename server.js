require('dotenv').config();
const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8000;

// GET / : renvoie le hostname du conteneur (format JSON)
app.get('/', (req, res) => {
  res.json({ hostname: os.hostname() });
});

// GET /health : renvoie un statut OK exploitable pour des probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;