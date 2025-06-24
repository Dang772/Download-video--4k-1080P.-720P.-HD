// File: api/getVideo.js
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'กรุณาใส่ลิงก์วิดีโอ' });
  }

  try {
    let videoFormats = [];

    if (url.includes('facebook.com') || url.includes('fb.watch')) {
      videoFormats = [
        { url: url, ext: 'mp4', height: 720, format_note: 'HD' }
      ];
    } else if (url.includes('tiktok.com')) {
      videoFormats = [
        { url: url, ext: 'mp4', height: 720, format_note: 'HD' }
      ];
    } else if (url.includes('instagram.com')) {
      videoFormats = [
        { url: url, ext: 'mp4', height: 720, format_note: 'HD' }
      ];
    } else {
      return res.status(400).json({ error: 'รองรับเฉพาะ TikTok, Facebook, Instagram เท่านั้น' });
    }

    res.status(200).json({ formats: videoFormats });
  } catch (err) {
    console.error('Error fetching video:', err);
    res.status(500).json({ error: 'ไม่สามารถดึงวิดีโอได้' });
  }
}
