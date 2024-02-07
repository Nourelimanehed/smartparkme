// src/routes/index.js
const express = require('express');
const userRoutes = require('./userRoutes');
const supabaseClient = require('./supabaseConfig');
//const parkingRoutes = require('./parkingRoutes');
//const paymentRoutes = require('./paymentRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const lotRoutes = require('./lotRoutes');
const router = express.Router();
router.use('/users', userRoutes);
//router.use('/payments', paymentRoutes); 
router.use('/vehicles', vehicleRoutes); 
router.use('/lots', lotRoutes);
//router.use('/parking', parkingRoutes);

module.exports = router;

