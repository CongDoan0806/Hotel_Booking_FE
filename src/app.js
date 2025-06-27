const express = require('express');
const cors = require('cors');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandle');
const app = express();

const userRoutes = require('./routes/user.routes')

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(errorHandler);

app.use('/api', userRoutes)

module.exports = app;


