const express = require('express');
const app = express();
const port = 68;

app.get('/api/v1/apod', (req, res) => {
    res.send('GET request captured');
})
app.post('/api/v1/apod', (req, res) => {
    res.send('POST request captured');
})
app.put('/api/v1/apod', (req, res) => {
    res.send('PUT request captured');
})
app.delete('/api/v1/apod', (req, res) => {
    res.send('DELETE request captured');
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/api/v1/apod`)
})