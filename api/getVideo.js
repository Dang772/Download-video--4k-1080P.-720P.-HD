// File: api/getVideo.js
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'กรุณาระบุ URL วิดีโอ' });
  }

  try {
    const { stdout } = await execAsync(`yt-dlp -j "${url}"`);
    const json = JSON.parse(stdout);
    const formats = json.formats.filter(f => f.ext === 'mp4' && f.url && f.height);

    const simplified = formats.map(f => ({
      url: f.url,
      ext: f.ext,
      height: f.height,
      format_note: f.format_note || f.format
    }));

    res.status(200).json({ formats: simplified });
  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err);
    res.status(500).json({ error: 'ไม่สามารถดึงวิดีโอได้' });
  }
}
