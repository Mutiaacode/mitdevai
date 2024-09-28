// api/chat.js
import axios from 'axios'; // Import Axios

export default async function handler(req, res) {
    // Pastikan ini hanya untuk POST request
    if (req.method === 'POST') {
        const { message, apikey } = req.body; // Mengambil data dari request body

        try {
            // Mengirim permintaan ke API eksternal
            const response = await axios.post('https://api.botcahx.eu.org/api/search/openai-custom', {
                message: message,
                apikey: apikey,
            });
            res.status(200).json(response.data); // Mengembalikan data dari API eksternal
        } catch (error) {
            console.error('Error:', error); // Log error untuk debug
            res.status(500).json({ error: error.message }); // Mengembalikan status error
        }
    } else {
        // Jika bukan POST request
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
