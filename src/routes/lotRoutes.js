// src/routes/lotRoutes.js

const express = require('express');
const { supabaseUrl, supabaseAnonKey, supabaseClient } = require('../routes/supabaseConfig');

const router = express.Router();

// structure [id, name , status ]
//Status : Reserved , Availabale , Occupied. 

//------------------------------------------------------
// Display our parking lots ( both ocuupied and free)
router.get('/display', async (req,res) => {
  try {
    const { data, error } = await supabaseClient.from('lots').select('*');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch lots' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch lots error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific lot by lot_id
router.get('/:lot_id', async (req, res) => {
  const { lot_id  } = req.params;

  try {
    const { data, error } = await supabaseClient.from('lots').select('*').eq('lot_id', lot_id);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch lot' });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Lot not found' });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Fetch lot error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Get lots by name

router.get('/name/:lot_name', async (req, res) => {
    const { lot_name } = req.params;
  
    try {
      const { data, error } = await supabaseClient.from('lots').select('*').eq('lot_name', lot_name);
  
      if (error) {
        return res.status(500).json({ error: 'Failed to fetch lot' });
      }
  
      if (data.length === 0) {
        return res.status(404).json({ error: 'Lot not found' });
      }
  
      res.status(200).json(data[0]);
    } catch (error) {
      console.error('Fetch lot error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Update lot status by lot_name
router.patch('/:lot_name', async (req, res) => {
    const { lot_name } = req.params;
    const { lot_status } = req.body;
  
    try {
      const { data, error } = await supabaseClient
        .from('lots')
        .update({ lot_status })
        .eq('lot_name', lot_name)
        .select();
  
      if (error) {
        console.error('Update lot status error:', error.message);
        return res.status(500).json({ error: 'Failed to update lot status' });
      }
  
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Lot not found' });
      }
  
      res.status(200).json(data[0]);
    } catch (error) {
      console.error('Update lot status error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;
