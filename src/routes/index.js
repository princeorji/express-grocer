const express = require('express');
const passport = require('passport')
const productRoutes = require('./product.routes');
const authRoutes = require('./auth.routes');
const cartRoutes = require('./cart.routes')

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/products', productRoutes);
routes.use('/cart', passport.authenticate('jwt', { session: false }), cartRoutes);

module.exports = routes;
