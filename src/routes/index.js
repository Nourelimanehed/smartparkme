// src/routes/index.js
const express = require('express');
const userRoutes = require('./userRoutes');
const parkingRoutes = require('./parkingRoutes');
const paymentRoutes = require('./paymentRoutes');
const vehicleRoutes = require('./vehicleRoutes');



const router = express.Router();

// Include user, payment, and vehicle routes
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes); 
router.use('/vehicles', vehicleRoutes); 
router.use('./parking', parkingRoutes);

module.exports = router;

