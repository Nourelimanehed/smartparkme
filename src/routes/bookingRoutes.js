const express = require('express');
const { supabaseClient } = require('../routes/supabaseConfig');
const { updateLotStatus } = require('./lotRoutes');

const router = express.Router();

// 1. Ongoing: The booking is currently active, and the user is in the parking lot.
// 2. Completed: The user has left the parking lot, and the booking is finished.
// 3. Canceled: The booking has been canceled by the user or system.
// 4. Pending: The user has made a booking, but hasn't arrived or scanned RFID yet.

// Confirm (Create) Booking

router.post('/confirm', async (req, res) => {
    try {
        const { lot_id, vehicle_id, date, start_time, end_time, distance } = req.body;

        // session and user information
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

        if (sessionError || !sessionData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user_id = sessionData.user.id;

        // Calculate duration in hours
        const startTime = new Date(`${date}T${start_time}`);
        const endTime = new Date(`${date}T${end_time}`);
        const amountPerHour = 30;
        const durationInMilliseconds = endTime - startTime;
        const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
        const totalAmount = durationInHours * amountPerHour;

        // get lot name
        const { data: lotNameData, error: lotNameError } = await supabaseClient
            .from('lots')
            .select('lot_name')
            .eq('lot_id', lot_id);

        if (lotNameError || !lotNameData || lotNameData.length === 0) {
            return res.status(500).json({ error: 'Failed to get lot name' });
        }

        // change lot status
        await updateLotStatus(lotNameData[0].lot_name, 'Reserved');

        // Insert booking into the database
        const { data, error } = await supabaseClient
            .from('booking')
            .insert([
                {
                    user_id,
                    lot_id,
                    vehicle_id,
                    date,
                    start_time,
                    end_time,
                    amount_paid: totalAmount,
                    distance,
                    status: 'pending',
                },
            ]);

        if (error) {
            return res.status(500).json({ error: 'Failed to confirm booking' });
        }

        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Confirm booking error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// cancel the booking operation
// Cancel Booking
router.post('/cancel', async (req, res) => {
    try {
        const { booking_id } = req.body;

        // Get booking details
        const { data: bookingData, error: bookingError } = await supabaseClient
            .from('booking')
            .select('*')
            .eq('booking_id', booking_id);

        if (bookingError || !bookingData || bookingData.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const { lot_id, status } = bookingData[0];

        // Check if the booking is cancellable 
        if (status === 'canceled' || status === 'completed') {
            return res.status(400).json({ error: 'Booking cannot be canceled' });
        }

        // Update lot status to Available
        const { data: lotNameData, error: lotNameError } = await supabaseClient
            .from('lots')
            .select('lot_name')
            .eq('lot_id', lot_id);

        if (lotNameError || !lotNameData || lotNameData.length === 0) {
            return res.status(500).json({ error: 'Failed to get lot name' });
        }
        await updateLotStatus(lotNameData[0].lot_name, 'Available');
        // Update booking status to Canceled

        const { data, error } = await supabaseClient
            .from('booking')
            .update({ status: 'canceled' })
            .eq('booking_id', booking_id)
            .select();

        if (error || !data || data.length === 0) {
            return res.status(500).json({ error: 'Failed to cancel booking' });
        }

        res.status(200).json(data[0]);
    } catch (error) {
        console.error('Cancel booking error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// display the booking by status


router.get('/:status', async (req, res) => {
    try {
        const { status } = req.params;

        //session and user information
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

        if (sessionError || !sessionData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user_id = sessionData.user.id;
        const { data, error } = await supabaseClient
            .from('booking')
            .select('*')
            .eq('user_id', user_id)
            .eq('status', status);

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch user bookings' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Fetch user bookings error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

