const express = require('express');
const cors = require('cors');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/users', require('./routes/user.routes'));

app.use(errorHandler);

module.exports = app;


