const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 8000;

const app = require('./src/app');

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});