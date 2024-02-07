const express = require('express');
const fetch = require('node-fetch'); 
const supabase = require('@supabase/supabase-js');
const supabaseUrl = 'https://bgynecsgqrdfrkcyshsz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJneW5lY3NncXJkZnJrY3lzaHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNzYxOTQsImV4cCI6MjAyMjg1MjE5NH0.-0gp9bF5zNXjHLp_WNDYSofyMr334kWZXSP3Aslg1tw';

const router = express.Router();
const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
// User login route

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Authenticate user using Supabase client library
      const { user, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  
      if (error) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // You can customize the response based on your needs
      res.status(200).json({ user });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// User registration route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Register user using Supabase
    const response = await fetch(`${supabaseUrl}/auth/v1/signup?apikey=${supabaseAnonKey}`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: 'User registration failed' });
    }


    res.status(201).json(data);
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign out
router.post('/signout', async (req, res) => {
    try {
      const { error } = await supabaseClient.auth.signOut();
  
      if (error) {
        return res.status(500).json({ error: 'Failed to sign out' });
      }
  
      res.status(200).json({ message: 'Sign-out successful' });
    } catch (error) {
      console.error('Sign-out error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
//  Email -update
router.post('/update-email', async (req, res) => {
    const { email } = req.body;
  
    try {
      const { data, error } = await supabaseClient.auth.updateUser({ email });
  
      if (error) {
        return res.status(500).json({ error: 'Failed to update email' });
      }
  
      res.status(200).json({ user: data });
    } catch (error) {
      console.error('Update email error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
//Reset password 
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://example.com/update-password',
      });
  
      if (error) {
        return res.status(500).json({ error: 'Failed to reset password' });
      }
  
      res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
      console.error('Reset password error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  
//  Update user profile
router.post('/update-profile', async (req, res) => {
    const { first_name, last_name, user_type, date_of_birth, phone_number, sex, picture } = req.body;
  
    try {
      const { user, error } = await supabaseClient.auth.user();
  
      const fieldsToUpdate = {
        first_name,
        last_name,
        user_type,
        date_of_birth,
        phone_number,
        sex,
        picture,
      };
  
      await updateProfile(fieldsToUpdate);
  
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Update profile error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

//--------------------------------------------------------------
//-------------------------------------------------------------
//--------------------------------------------------------
module.exports = router;
