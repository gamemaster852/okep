const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    // Set CORS agar bisa diakses dari frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        const targetUrl = 'https://missav.ws/id/site/supjav';
        const { data } = await axios.get(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
            }
        });
        
        const $ = cheerio.load(data);
        const results = [];

        // Selektor presisi untuk judul, thumbnail, dan link
        $('div.grid > div').each((i, el) => {
            const title = $(el).find('h2, h3, .title').text().trim();
            const thumbnail = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
            const link = $(el).find('a').attr('href');

            if (title && thumbnail) {
                results.push({ title, thumbnail, link });
            }
        });

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'Gagal bypass sistem target', detail: error.message });
    }
};
