const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 68;
const endpoint = `http://localhost:${port}/api`;

app.use(cors());

app.get('/api/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({ message: 'GET request captured' });
});
app.post('/api/', (req, res) => {
    res.send('POST request captured');
});
app.put('/api/', (req, res) => {
    res.send('PUT request captured');
});
app.delete('/api/', (req, res) => {
    res.send('DELETE request captured');
});

app.listen(port, () => {
    console.log(`Listening on ${endpoint}`)
});
