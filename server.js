const express = require('express');
const pool = require('./src/config/db');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World')
})


// Mock API to fetch data from the database for testing the connection
app.get('/example-api', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

app.listen(8000, () => console.log(`Server is running on port 8000`));