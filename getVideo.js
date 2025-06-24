import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'ลิงก์ไม่ถูกต้อง' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

    res.status(200).json({ formats });
  } catch (err) {
    console.error('Error fetching video:', err);
    res.status(500).json({ error: 'ไม่สามารถดึงวิดีโอได้' });
  }
}
