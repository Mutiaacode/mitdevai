const express = require('express'); // Import Express
const cors = require('cors');       // Import CORS
const axios = require('axios');     // Import Axios
require('dotenv').config();          // Load environment variables

const app = express();               // Initialize Express app
const port = process.env.PORT || 5000; // Use environment port or default to 5000

// Middleware to allow requests from http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());             // Middleware for JSON parsing

// Route for GET request at root
app.get('/', (req, res) => {
    res.send('Server berjalan dengan baik'); // Response for GET /
});

// Endpoint for chat API
app.post('/api/chat', async (req, res) => {
    const { message, apikey } = req.body; // Get data from request body

    if (!message || !apikey) {
        return res.status(400).send('Message and API key are required.');
    }

    try {
        // Send request to external API
        const response = await axios.post('https://api.botcahx.eu.org/api/search/openai-custom', {
            message: message,
            apikey: apikey,
        });
        res.json(response.data); // Return data from external API
    } catch (error) {
        console.error('Error:', error); // Log error for debugging
        res.status(500).send('Error: ' + error.message); // Return error status
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
