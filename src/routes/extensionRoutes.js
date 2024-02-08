// src/routes/extensionRoutes.js

const express = require('express');
const { supabaseClient } = require('../routes/supabaseConfig');

const router = express.Router();

// Function to calculate the total cost including extension
const calculateTotalCost = (bookingAmount, extensionAmount) => {
    return bookingAmount + extensionAmount;
  };
  
  // Extend parking time
router.post('/extend', async (req, res) => {
    try {
      //session and user information
      const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
  
      if (sessionError || !sessionData) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const user_id = sessionData.user.id;
      const { booking_id, additional_duration } = req.body;
  
      // Fetch booking information
      const { data: bookingData, error: bookingError } = await supabaseClient
        .from('booking')
        .select('*')
        .eq('booking_id', booking_id)
        .single();
  
      if (bookingError) {
        return res.status(500).json({ error: 'Failed to fetch booking information' });
      }
  
      const currentEndTime = new Date(bookingData.end_time);
      const updatedEndTime = new Date(currentEndTime.getTime() + additional_duration * 60 * 60 * 1000);
      const amountPerHour = 30;
      const extensionAmount = additional_duration * amountPerHour;
  
      // Insert extension record into the 'extension' table
      const { data: extensionData, error: extensionError } = await supabaseClient
        .from('extension')
        .insert([
          {
            booking_id: bookingData.booking_id,
            extension_time: additional_duration,
            extension_amount: extensionAmount,
            timestamp: new Date(),
          },
        ]);
  
      if (extensionError) {
        return res.status(500).json({ error: 'Failed to record extension' });
      }
  
      // Update booking's end time in the 'booking' table
      const { data: updateData, error: updateError } = await supabaseClient
        .from('booking')
        .update({ end_time: updatedEndTime })
        .eq('booking_id', bookingData.booking_id)
        .select();
  
      if (updateError) {
        return res.status(500).json({ error: 'Failed to update booking end time' });
      }
  
      // Calculate total cost
      const totalCost = calculateTotalCost(bookingData.amount_paid, extensionAmount);
  
      // Send the updated booking information and total cost to the client
      res.status(200).json({ updatedBooking: updateData[0], extension: extensionData[0], totalCost });
    } catch (error) {
      console.error('Extend parking time error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Cancel Extension
router.delete('/cancel/:extension_id', async (req, res) => {
    
      const { extension_id } = req.params;
 
      await supabaseClient
        .from('extension')
        .delete()
        .eq('extension_id', extension_id);
  
     
      
  });
  
  module.exports = router;
  