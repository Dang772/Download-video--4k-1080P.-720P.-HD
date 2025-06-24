import ytdl from 'ytdl-core';

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'กรุณาใส่ URL' });
    }

    try {
        if (ytdl.validateURL(url)) {
            const info = await ytdl.getInfo(url);
            res.status(200).json(info);
        } else {
            res.status(400).json({ error: 'URL ไม่ถูกต้อง' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงวิดีโอ' });
    }
}
