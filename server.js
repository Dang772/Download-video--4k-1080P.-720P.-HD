const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get('/api/getVideo', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'กรุณาใส่ URL' });
    }

    try {
        const videoInfo = await ytdlp(videoUrl, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true
        });

        res.json(videoInfo);
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลวิดีโอได้' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
