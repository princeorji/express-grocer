const express = require('express');
const productRoutes = require('./product.routes');
const authRoutes = require('./auth.routes');

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/products', productRoutes);

module.exports = routes;
