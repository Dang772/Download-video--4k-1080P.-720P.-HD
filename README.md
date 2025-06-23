โครงสร้างโปรเจกต์ตัวเต็ม:

/ (โฟลเดอร์หลัก) 
├── index.html             // หน้าเว็บหลัก 
├── server.js              // API สำหรับดึงวิดีโอ 
├── manifest.json          // สำหรับ PWA 
├── service-worker.js      // สำหรับโหลดเร็ว (PWA) 
├── README.md              // คำอธิบายโปรเจกต์ 
├── /images                // รูปภาพโฆษณาหรือ favicon (ถ้ามี) 
└── /ads                   // โฟลเดอร์เก็บไฟล์โฆษณา (ถ้ามี)

// index.html

<!DOCTYPE html><html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ดาวน์โหลดวิดีโอ 4K 1080P 720P</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#0077b6">
    <link rel="icon" href="images/favicon.png">
    <style>
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #00b4d8, #90e0ef); display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; color: #0077b6; }
        .container { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); text-align: center; max-width: 500px; width: 90%; animation: fadeIn 1s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        input[type="text"] { padding: 10px; width: 80%; border: 1px solid #0077b6; border-radius: 8px; margin-bottom: 20px; }
        button { padding: 10px 20px; background-color: #0077b6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #023e8a; }
        .download-btn { display: inline-block; margin: 10px; padding: 10px 20px; background-color: #0096c7; color: white; text-decoration: none; border-radius: 8px; }
        .download-btn:hover { background-color: #0077b6; }
        .ads { margin-top: 30px; padding: 15px; background-color: #caf0f8; border-radius: 10px; }
        .video-ad-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); display: flex; justify-content: center; align-items: center; z-index: 9999; display: none; flex-direction: column; color: white; }
        .video-ad-overlay video { max-width: 90%; border-radius: 12px; }
        .close-ad-btn { margin-top: 20px; padding: 10px 20px; background-color: #ff4d4d; border: none; border-radius: 8px; cursor: not-allowed; font-size: 16px; opacity: 0.6; }
        .close-ad-btn.enabled { cursor: pointer; opacity: 1; }
    </style>
</head>
<body>
    <div class="container">
        <h1>ดาวน์โหลดวิดีโอออนไลน์</h1>
        <input type="text" id="videoURL" placeholder="วางลิงก์วิดีโอที่นี่">
        <br>
        <button onclick="simulateDownload()">ดึงวิดีโอ</button>
        <div id="result"></div>
        <div class="ads">
            <p>โฆษณาของคุณ ✨</p>
            <img src="images/ad1.jpg" width="100%">
            <img src="images/ad2.jpg" width="100%">
        </div>
    </div>
    <div class="video-ad-overlay" id="videoAd">
        <video id="adVideo" controls autoplay>
            <source src="ads/ad-video.mp4" type="video/mp4">
            วิดีโอไม่สามารถเล่นได้
        </video>
        <button class="close-ad-btn" id="closeAdBtn" onclick="closeAd()" disabled>ข้ามโฆษณา (5)</button>
    </div><script>
    if ('serviceWorker' in navigator) { navigator.serviceWorker.register('service-worker.js'); }
    let selectedDownloadLink = '';
    let countdown = 5;
    let countdownInterval;
    async function simulateDownload() {
        const url = document.getElementById('videoURL').value.trim();
        const result = document.getElementById('result');
        if (!url) { result.innerHTML = '<p style="color:red;">กรุณาวางลิงก์ก่อน</p>'; return; }
        const res = await fetch(`/api/getVideo?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        if (data.formats) {
            let html = '<h3>เลือกระดับความคมชัด:</h3>';
            data.formats.forEach(format => {
                if (format.ext === 'mp4' && format.url) {
                    html += `<a class="download-btn" href="#" onclick="showAd('${format.url}')">${format.format_note || ''} - ${format.height || ''}p</a>`;
                }
            });
            result.innerHTML = html;
        } else { result.innerHTML = '<p style="color:red;">ไม่สามารถดึงวิดีโอได้</p>'; }
    }
    function showAd(downloadLink) {
        selectedDownloadLink = downloadLink;
        document.getElementById('videoAd').style.display = 'flex';
        document.getElementById('adVideo').currentTime = 0;
        document.getElementById('adVideo').play();
        countdown = 5;
        const closeAdBtn = document.getElementById('closeAdBtn');
        closeAdBtn.innerText = `ข้ามโฆษณา (${countdown})`;
        closeAdBtn.disabled = true;
        closeAdBtn.classList.remove('enabled');
        countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                closeAdBtn.innerText = `ข้ามโฆษณา (${countdown})`;
            } else {
                clearInterval(countdownInterval);
                closeAdBtn.innerText = 'ข้ามโฆษณา';
                closeAdBtn.disabled = false;
                closeAdBtn.classList.add('enabled');
            }
        }, 1000);
    }
    function closeAd() {
        const closeAdBtn = document.getElementById('closeAdBtn');
        if (closeAdBtn.disabled) return;
        document.getElementById('videoAd').style.display = 'none';
        window.open(selectedDownloadLink, '_blank');
    }
</script>

</body>
</html>// server.js 
const express = require('express'); 
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');

const app = express(); 
const port = 3000;

app.use(cors()); 
app.use(express.static(__dirname));

app.get('/api/getVideo', async (req, res) => { 
const videoUrl = req.query.url; 
if (!videoUrl)  { 
    return res.status(400).json( { 
    error: 'กรุณาใส่ URL' }); 
    } 
    try { 
    const videoInfo = await ytdlp(videoUrl,{ 
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
console.log(Server is running on http://localhost:${port});
});

// manifest.json 
{
"name": "ดาวน์โหลดวิดีโอ 4K 1080P 720P", 
"short_name": "VideoDL", 
"start_url": ".", "display": "standalone", 
"background_color": "#ffffff", 
"theme_color": "#0077b6", 
"icons": [ 
    { 
         "src": "images/favicon.png", 
         "sizes": "192x192", "type": 
         "image/png" 
       } 
    ] 
 }

// service-worker.js 
self.addEventListener('install', 
    event => { event.waitUntil( 
        caches.open('video-cache').then(cache => { 
            return cache.addAll([ '/', 
            '/index.html', 
            '/manifest.json', 
            '/images/favicon.png' 
        ]);
     })  
   );
});

self.addEventListener('fetch', 
event => { event.respondWith( 
    caches.match(event.request).then(response => { 
        return response || fetch(event.request); 
     }) 
   ); 
});

// README.md
ดาวน์โหลดวิดีโอ 4K 1080P 720P

วิธีใช้งาน
วางลิงก์วิดีโอจาก TikTok, Facebook, YouTube, Instagram
เลือกความละเอียด
กดดาวน์โหลด

คุณสมบัติ
รองรับหลายแพลตฟอร์ม
มีโฆษณา
PWA: Add to Home Screen ได้
โหลดเร็วด้วย Service Worker
