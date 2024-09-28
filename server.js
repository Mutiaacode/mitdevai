const express = require('express');  // Import Express
const cors = require('cors');        // Import CORS
const axios = require('axios');      // Import Axios

const app = express();               // Inisialisasi aplikasi Express
const port = 5000;                   // Port untuk server

// Middleware untuk mengizinkan permintaan dari http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());             // Middleware untuk parsing JSON

// Route untuk GET request di root
app.get('/', (req, res) => {
    res.send('Server berjalan dengan baik'); // Respon untuk GET /
});

// Endpoint untuk API chat
app.post('/api/chat', async (req, res) => {
    const { message, apikey } = req.body; // Mengambil data dari request body

    try {
        // Mengirim permintaan ke API eksternal
        const response = await axios.post('https://api.botcahx.eu.org/api/search/openai-custom', {
            message: message,
            apikey: apikey,
        });
        res.json(response.data); // Mengembalikan data dari API eksternal
    } catch (error) {
        console.error('Error:', error); // Log error untuk debug
        res.status(500).send('Error: ' + error.message); // Mengembalikan status error
    }
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
