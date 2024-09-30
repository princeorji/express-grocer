const express = require('express');
const productRoutes = require('./product.routes');

const routes = express.Router();

routes.use('/products', productRoutes);

module.exports = routes;
