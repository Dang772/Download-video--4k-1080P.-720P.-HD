import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'กรุณาใส่ URL' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const formats = info.formats.map(format => ({
      url: format.url,
      format_note: format.qualityLabel,
      height: format.height,
      ext: format.container
    }));

    res.status(200).json({ formats });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลวิดีโอได้' });
  }
}
