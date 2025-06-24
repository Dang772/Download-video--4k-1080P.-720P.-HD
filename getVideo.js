// api/getVideo.js
import ytdl from 'ytdl-core';

export default async function 
handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

        const result = formats.map(format => ({
            url: format.url,
            quality: format.qualityLabel,
            ext: format.container
        }));

        res.status(200).json({ formats: result });
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ error: 'Error fetching video' });
    }
}
