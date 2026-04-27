const request = require('supertest');
const express = require('express');
const os = require('os');

// Create app for testing without starting the server
const app = express();

// GET / : renvoie le hostname du conteneur (format JSON)
app.get('/', (req, res) => {
  res.json({ hostname: os.hostname() });
});

// GET /health : renvoie un statut OK exploitable pour des probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

describe('API Tests', () => {
  test('GET / should return hostname in JSON format', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('hostname');
    expect(typeof response.body.hostname).toBe('string');
    expect(response.body.hostname).toBe(os.hostname());
  });

  test('GET /health should return OK status', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ status: 'OK' });
  });
});