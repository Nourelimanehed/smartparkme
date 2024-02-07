// src/routes/vehicleRoutes.js

const express = require('express');
const { supabaseClient } = require('../routes/supabaseConfig');

const router = express.Router();

// Add a new vehicle
router.post('/add', async (req, res) => {
    
        const { user_id, vehicle_type, vehicle_model, vehicle_picture_url } = req.body;

      // session and user information
     // const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
  
     // if (sessionError || !sessionData) {
       // return res.status(401).json({ error: 'Unauthorized' });
      //}
  
      //const user_id = sessionData.user.id;
    
        const { data, error } = await supabaseClient.from('vehicles').insert([
          { user_id, vehicle_type, vehicle_model, vehicle_picture_url },
        ]);
    
      
     
    });
  

// Delete a vehicle by vehicle_id
router.delete('/delete/:vehicle_id', async (req, res) => {
    const { vehicle_id } = req.params;
  
      const { data, error } = await supabaseClient.from('vehicles').delete().eq('vehicle_id', vehicle_id);
  
     
  });
  

// for test only Display default vehicles
router.get('/defaults', async (req, res) => {
  try {
    const { data, error } = await supabaseClient.from('default_vehicles').select('*');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch default vehicles' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch default vehicles error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});






module.exports = router;
