const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/index');

const app = express();

app.use(morgan('dev'));

app.use(cors());
app.use(express.json());

app.use('/api/v1', routes);

// Handle errors.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! 😵');
});

module.exports = app;
