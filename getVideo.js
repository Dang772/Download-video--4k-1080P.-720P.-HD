// File: api/getVideo.js

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || url.trim() === '') {
    return res.status(400).json({ error: 'กรุณาวางลิงก์ก่อน' });
  }

  // ตรวจสอบว่า URL เป็นของ TikTok, Facebook หรือ Instagram
  const lowerUrl = url.toLowerCase();
  const isSupported =
    lowerUrl.includes('tiktok.com') ||
    lowerUrl.includes('facebook.com') ||
    lowerUrl.includes('fb.watch') ||
    lowerUrl.includes('instagram.com');

  if (!isSupported) {
    return res.status(400).json({ error: 'รองรับเฉพาะ TikTok, Facebook และ Instagram เท่านั้น' });
  }

  // จำลองข้อมูลวิดีโอแบบง่าย
  const formats = [
    {
      url: 'https://example.com/video-720p.mp4',
      ext: 'mp4',
      height: 720,
      format_note: '720p'
    },
    {
      url: 'https://example.com/video-1080p.mp4',
      ext: 'mp4',
      height: 1080,
      format_note: '1080p'
    },
    {
      url: 'https://example.com/video-4k.mp4',
      ext: 'mp4',
      height: 2160,
      format_note: '4K'
    }
  ];

  return res.status(200).json({ formats });
}
