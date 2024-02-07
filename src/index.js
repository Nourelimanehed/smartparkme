// src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');


const app = express();
const PORT = process.env.PORT || 3000;

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello, this is your Express API!');
});

// Use the routes defined in the 'routes' directory
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
