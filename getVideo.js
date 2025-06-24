// api/getVideo.js
const ytdl = require('ytdl-core');

export default async function handler(req, res) {
    try {
        const videoUrl = req.query.url;

        if (!videoUrl) {
            return res.status(400).json({ error: 'Missing video URL' });
        }

        const info = await ytdl.getInfo(videoUrl);
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

        const availableFormats = formats.map(format => ({
            url: format.url,
            quality: format.qualityLabel,
            ext: format.container,
            format_note: format.qualityLabel,
            height: format.height
        }));

        res.status(200).json({ formats: availableFormats });
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ error: error.message });
    }
}
