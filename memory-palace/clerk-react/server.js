import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const startPort = 3001;
const maxPort = 3010;

app.use(cors());
app.use(express.json());

app.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    console.log('Received request for URL:', url);

    if (!url) {
      console.error('No URL provided');
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log('Fetching content from:', url);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    console.log('Successfully fetched content, length:', response.data.length);

    res.json({ html: response.data });
  } catch (error) {
    console.error('Proxy error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Try ports sequentially until one works
const tryPort = (port) => {
  app.listen(port)
    .on('listening', () => {
      console.log(`Proxy server running at http://localhost:${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE' && port < maxPort) {
        console.log(`Port ${port} is in use, trying ${port + 1}...`);
        tryPort(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
};

tryPort(startPort);
