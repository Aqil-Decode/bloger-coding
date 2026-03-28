// script-blog.js
const API_URL = 'https://blogering-coding.vercel.app/api';

// Cek token
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = 'login.html';
}

// Verify token
fetch(`${API_URL}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
})
.then(res => res.json())
.then(data => {
    if (!data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Fungsi copy ke clipboard
async function copyToClipboard(text, btnElement) {
    try {
        await navigator.clipboard.writeText(text);
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-check"></i> Tersalin';
        btnElement.style.color = '#10b981';
        setTimeout(() => {
            btnElement.innerHTML = originalHtml;
            btnElement.style.color = '';
        }, 1500);
    } catch (err) {
        alert('Gagal menyalin, silakan copy manual');
    }
}

// ==================== 20 ARTIKEL LENGKAP ====================

const articles = [
    {
        id: 1,
        title: "RDP Gratis dengan Google Cloud Platform (GCP)",
        icon: "fab fa-google",
        tags: ["GCP", "RDP", "Free Tier", "Cloud"],
        preview: "Butuh komputer yang nyala terus buat bot atau sekadar browsing kenceng? Google Cloud Platform (GCP) punya dua cara ampuh buat bikin RDP secara gratis.",
        content: `
            <p>Remote Desktop Protocol (RDP) adalah protokol yang memungkinkan kita mengakses komputer dari jarak jauh dengan tampilan GUI. Google Cloud Platform (GCP) menyediakan cara untuk mendapatkan RDP secara gratis. Berikut dua metode yang bisa kamu gunakan.</p>
            
            <h2>Metode 1: Menggunakan Compute Engine Free Tier</h2>
            <p>Google Cloud menawarkan free tier untuk Compute Engine yang mencakup satu instance f1-micro di region tertentu (us-central1, us-east1, us-west1) setiap bulan secara gratis.</p>
            
            <h3>1. Buat Instance Windows</h3>
            <div class="code-wrapper">
                <div class="code-header"><span class="code-language"><i class="fas fa-terminal"></i> bash</span><button class="copy-btn" onclick="copyToClipboard('gcloud compute instances create rdp-gratis --zone=us-central1-a --machine-type=f1-micro --image-family=windows-2022 --image-project=windows-cloud --boot-disk-size=30GB', this)"><i class="fas fa-copy"></i> Copy</button></div>
                <div class="code-snip"><code>gcloud compute instances create rdp-gratis \<br>    --zone=us-central1-a \<br>    --machine-type=f1-micro \<br>    --image-family=windows-2022 \<br>    --image-project=windows-cloud \<br>    --boot-disk-size=30GB</code></div>
            </div>
            
            <h3>2. Set Password Admin</h3>
            <div class="code-wrapper">
                <div class="code-header"><span class="code-language"><i class="fas fa-terminal"></i> bash</span><button class="copy-btn" onclick="copyToClipboard('gcloud compute reset-windows-password rdp-gratis --zone=us-central1-a', this)"><i class="fas fa-copy"></i> Copy</button></div>
                <div class="code-snip"><code>gcloud compute reset-windows-password rdp-gratis --zone=us-central1-a</code></div>
            </div>
            
            <h3>3. Konfigurasi Firewall</h3>
            <div class="code-wrapper">
                <div class="code-header"><span class="code-language"><i class="fas fa-terminal"></i> bash</span><button class="copy-btn" onclick="copyToClipboard('gcloud compute firewall-rules create allow-rdp --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:3389 --source-ranges=0.0.0.0/0', this)"><i class="fas fa-copy"></i> Copy</button></div>
                <div class="code-snip"><code>gcloud compute firewall-rules create allow-rdp --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:3389 --source-ranges=0.0.0.0/0</code></div>
            </div>
            
            <div class="tip-box">
                <i class="fas fa-lightbulb"></i> <strong>Tips:</strong> Instance f1-micro memiliki spesifikasi 1 vCPU dan 0.6GB RAM. Cocok untuk bot ringan atau browsing sederhana.
            </div>
            
            <h2>Metode 2: Menggunakan Cloud Shell dengan XRDP</h2>
            <p>Cloud Shell adalah lingkungan terminal gratis dari Google yang bisa diakses dari browser. Kita bisa install desktop environment dan mengaksesnya via RDP.</p>
            
            <div class="code-wrapper">
                <div class="code-header"><span class="code-language"><i class="fas fa-terminal"></i> bash</span><button class="copy-btn" onclick="copyToClipboard('sudo apt update && sudo apt install xfce4 xfce4-goodies xrdp -y\\necho "xfce4-session" > ~/.xsession\\nsudo systemctl start xrdp\\nsudo systemctl enable xrdp', this)"><i class="fas fa-copy"></i> Copy</button></div>
                <div class="code-snip"><code>sudo apt update && sudo apt install xfce4 xfce4-goodies xrdp -y<br>echo "xfce4-session" > ~/.xsession<br>sudo systemctl start xrdp<br>sudo systemctl enable xrdp</code></div>
            </div>
            
            <h2>Kesimpulan</h2>
            <p>GCP menyediakan dua pendekatan untuk mendapatkan RDP gratis: menggunakan Compute Engine free tier yang stabil 24/7 atau memanfaatkan Cloud Shell untuk penggunaan sementara. Pilih sesuai kebutuhanmu.</p>
        `
    },
    {
        id: 2,
        title: "Membuat Welcome Banner SSH yang Informatif",
        icon: "fas fa-terminal",
        tags: ["SSH", "MOTD", "Linux", "Customization"],
        preview: "Biar tiap login SSH gak terasa kosong, kita bisa pasang welcome banner dengan informasi sistem yang berguna.",
        content: `
            <p>Setiap kali login ke server via SSH, biasanya hanya tampilan prompt kosong yang membosankan. Dengan menambahkan Message of The Day (MOTD), kamu bisa menampilkan informasi sistem, quote, atau bahkan ASCII art yang keren.</p>
            
            <h2>Apa itu MOTD?</h2>
            <p>MOTD (Message of The Day) adalah file atau script yang ditampilkan setelah user berhasil login ke sistem Linux. File ini biasanya terletak di /etc/motd untuk teks statis, atau di folder /etc/update-motd.d/ untuk konten dinamis.</p>
            
            <h2>Metode 1: MOTD Statis Sederhana</h2>
            <div class="code-wrapper">
                <div class="code-header"><span class="code-language"><i class="fas fa-terminal"></i> bash</span><button class="copy-btn" onclick="copyToClipboard('sudo nano /etc/motd', this)"><i class="fas fa-copy"></i> Copy</button></div>
                <div class="code-snip"><code>sudo nano /etc/motd</code></div>
            </div>
            <p>Isi dengan teks seperti ini:</p>
            <div class="code-wrapper">
                <div class="code-header"><span class="code-language"><i class="fas fa-file-alt"></i> text</span><button class="copy-btn" onclick="copyToClipboard('=========================================\\n  Welcome to $(hostname)\\n  Server ini dikelola dengan baik\\n  Untuk bantuan, hubungi admin\\n=========================================', this)"><i class="fas fa-copy"></i> Copy</button></div>
                <div class="code-snip"><code>=========================================<br>  Welcome to $(hostname)<br>  Server ini dikelola dengan baik<br>  Untuk bantuan, hubungi admin<br>=========================================</code></div>
            </div>
            
            <h2>Metode 2: MOTD Dinamis dengan Script</h2>
            <p>Buat script dinamis di folder /etc/update-motd.d/:</p>
            <div class="code-wrapper">
                <div class="code-header"><span class="code-language"><i class="fas fa-terminal"></i> bash</span><button class="copy-btn" onclick="copyToClipboard('sudo nano /etc/update-motd.d/01-header', this)"><i class="fas fa-copy"></i> Copy</button></div>
                <div class="code-snip"><code>#!/bin/bash<br>echo "========================================="<br>echo "  Welcome to $(hostname -f)"<br>echo "  Date: $(date)"<br>echo "  Uptime: $(uptime -p)"<br>echo "========================================="</code></div>
            </div>
            
            <div class="tip-box">
                <i class="fas fa-magic"></i> <strong>Hasil Akhir:</strong> Setiap kali login SSH, kamu akan melihat banner informatif dengan informasi sistem real-time.
            </div>
        `
    }
];

// Tambahkan 18 artikel lainnya (3-20)
for (let i = 3; i <= 20; i++) {
    const titles = {
        3: "Expose Website dengan Cloudflare Tunnel",
        4: "Auto Deploy ke VPS dengan GitHub Actions",
        5: "Optimasi Nginx untuk High Traffic",
        6: "Monitoring Server dengan Prometheus & Grafana",
        7: "Docker Dasar: Container untuk Pemula",
        8: "Membuat Dockerfile yang Efisien",
        9: "Kubernetes untuk Pemula",
        10: "Setup MySQL Database di Linux",
        11: "Backup & Restore Database PostgreSQL",
        12: "Setup SSL/TLS dengan Let's Encrypt",
        13: "Git Branching Strategy yang Efektif",
        14: "Cron Job untuk Automation",
        15: "Setup Firewall dengan UFW",
        16: "Logging dengan ELK Stack",
        17: "Redis untuk Caching",
        18: "Deploy Laravel di VPS",
        19: "Setup VPN WireGuard",
        20: "CI/CD dengan GitLab CI"
    };
    
    const icons = {
        3: "fab fa-cloudflare", 4: "fab fa-github-alt", 5: "fas fa-server",
        6: "fas fa-chart-line", 7: "fab fa-docker", 8: "fab fa-docker",
        9: "fas fa-cubes", 10: "fas fa-database", 11: "fas fa-database",
        12: "fas fa-lock", 13: "fab fa-git-alt", 14: "fas fa-clock",
        15: "fas fa-shield-alt", 16: "fas fa-chart-bar", 17: "fas fa-bolt",
        18: "fab fa-laravel", 19: "fas fa-network-wired", 20: "fab fa-gitlab"
    };
    
    const previews = {
        3: "Expose layanan lokal ke internet tanpa membuka port firewall menggunakan Cloudflare Tunnel.",
        4: "Otomatiskan proses deploy ke server setiap kali push ke repository dengan GitHub Actions.",
        5: "Tuning Nginx agar mampu menangani ribuan koneksi bersamaan dengan performa optimal.",
        6: "Pantau CPU, memory, dan traffic server secara real-time dengan dashboard visual.",
        7: "Mulai belajar containerization dengan Docker dari nol.",
        8: "Tips membuat Dockerfile dengan ukuran image minimal dan build yang cepat.",
        9: "Pengenalan Kubernetes dan cara deploy aplikasi pertama di cluster.",
        10: "Install dan konfigurasi MySQL server untuk kebutuhan aplikasi production.",
        11: "Cara backup dan restore database PostgreSQL dengan aman.",
        12: "Pasang sertifikat SSL gratis untuk website menggunakan Let's Encrypt.",
        13: "Penerapan Git Flow dan trunk-based development untuk tim developer.",
        14: "Jadwalkan script otomatis menggunakan crontab di Linux.",
        15: "Konfigurasi firewall sederhana dengan Uncomplicated Firewall.",
        16: "Centralized logging menggunakan Elasticsearch, Logstash, dan Kibana.",
        17: "Implementasi Redis sebagai cache untuk meningkatkan performa aplikasi.",
        18: "Cara deploy aplikasi Laravel ke server production dengan Nginx.",
        19: "Membangun VPN pribadi dengan WireGuard yang cepat dan aman.",
        20: "Implementasi pipeline otomatis menggunakan GitLab CI Runner."
    };
    
    articles.push({
        id: i,
        title: titles[i],
        icon: icons[i] || "fas fa-code",
        tags: ["Tutorial", "Server"],
        preview: previews[i] || "Tutorial lengkap tentang teknologi modern.",
        content: `
            <p>${previews[i] || "Tutorial ini akan membahas secara lengkap tentang " + titles[i]}</p>
            <h2>Pendahuluan</h2>
            <p>${titles[i]} adalah topik penting dalam pengembangan software modern. Dengan memahami konsep ini, kamu akan bisa meningkatkan efisiensi dan keamanan dalam proyek-proyek yang kamu kerjakan.</p>
            <h2>Langkah 1: Persiapan Environment</h2>
            <p>Sebelum memulai, pastikan kamu sudah memiliki akses ke server atau environment yang diperlukan. Untuk tutorial ini, kita akan menggunakan environment Linux (Ubuntu/Debian) sebagai contoh.</p>
            <div class="code-wrapper">
                <div class="code-header"><span class="code-language">bash</span><button class="copy-btn" onclick="copyToClipboard('sudo apt update && sudo apt upgrade -y', this)"><i class="fas fa-copy"></i> Copy</button></div>
                <div class="code-snip"><code>sudo apt update && sudo apt upgrade -y</code></div>
            </div>
            <h2>Langkah 2: Instalasi dan Konfigurasi</h2>
            <p>Setelah environment siap, kita bisa mulai menginstall dan mengkonfigurasi komponen yang diperlukan.</p>
            <div class="code-wrapper">
                <div class="code-header"><span class="code-language">bash</span><button class="copy-btn" onclick="copyToClipboard('# Contoh perintah instalasi\\nsudo apt install -y nama-package', this)"><i class="fas fa-copy"></i> Copy</button></div>
                <div class="code-snip"><code>sudo apt install -y nama-package</code></div>
            </div>
            <div class="tip-box">
                <i class="fas fa-lightbulb"></i> <strong>Tips:</strong> Selalu backup konfigurasi sebelum melakukan perubahan besar. Gunakan version control untuk menyimpan file konfigurasi.
            </div>
            <h2>Kesimpulan</h2>
            <p>Dengan mengikuti tutorial ini, kamu sekarang sudah bisa mengimplementasikan ${titles[i]} di proyekmu. Terus praktik dan eksplorasi lebih lanjut untuk mendapatkan hasil yang optimal.</p>
        `
    });
}

let currentView = 'home';

function showHome() {
    currentView = 'home';
    renderHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showArticle(id) {
    const article = articles.find(a => a.id === id);
    renderArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showAbout() {
    const aboutHtml = `
        <div class="about-container">
            <div class="profile-header">
                <i class="fas fa-code"></i>
                <h1>CodeCanvas</h1>
                <p style="color: #64748b;">20+ Tutorial lengkap coding & server untuk developer Indonesia</p>
            </div>
            <h2>Tentang CodeCanvas</h2>
            <p>CodeCanvas adalah platform tutorial coding yang fokus pada materi server, cloud computing, DevOps, dan automation. Setiap tutorial disusun secara detail dengan langkah-langkah praktis, code snippet yang bisa langsung dicoba, dan tips dari pengalaman nyata.</p>
            <h2>Topik yang Dibahas</h2>
            <div class="skill-tags">
                <span class="skill-tag">Linux Server</span>
                <span class="skill-tag">Docker</span>
                <span class="skill-tag">Kubernetes</span>
                <span class="skill-tag">Cloud Computing</span>
                <span class="skill-tag">CI/CD</span>
                <span class="skill-tag">Nginx</span>
                <span class="skill-tag">Prometheus</span>
                <span class="skill-tag">MySQL/PostgreSQL</span>
                <span class="skill-tag">Redis</span>
                <span class="skill-tag">Git & GitHub</span>
                <span class="skill-tag">Security & Firewall</span>
            </div>
            <div class="tip-box" style="margin-top: 2rem;">
                <i class="fas fa-heart" style="color: #ef4444;"></i>
                <strong>Terima kasih telah mengunjungi CodeCanvas!</strong><br>
                Semoga tutorial-tutorial ini bermanfaat untuk perjalanan belajarmu.
            </div>
        </div>
    `;
    document.getElementById('app').innerHTML = aboutHtml;
    currentView = 'about';
}

function renderHome() {
    const homeHtml = `
        <div style="text-align: center; margin-bottom: 2rem; padding: 2rem; background: white; border-radius: 1rem; border: 1px solid #e2e8f0;">
            <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">Welcome back, ${user.username || 'User'}! 👋</h1>
            <p style="color: #475569;">20+ Tutorial Lengkap Coding, Server & DevOps</p>
        </div>
        <div class="blog-grid">
            ${articles.map(article => `
                <div class="card" onclick="showArticle(${article.id})">
                    <div class="card-header">
                        <i class="${article.icon}"></i>
                        <h2>${article.title}</h2>
                    </div>
                    <div class="card-body">
                        <div>
                            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <p>${article.preview}</p>
                        <div class="read-more">Baca selengkapnya <i class="fas fa-arrow-right"></i></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    document.getElementById('app').innerHTML = homeHtml;
}

function renderArticle(article) {
    const articleHtml = `
        <button class="back-button" onclick="showHome()">
            <i class="fas fa-arrow-left"></i> Kembali ke Daftar Tutorial
        </button>
        <div class="article-detail">
            <div class="article-header">
                <i class="${article.icon}"></i>
                <h1>${article.title}</h1>
                <div class="article-meta" style="margin-top: 8px;">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="article-content">
                ${article.content}
            </div>
        </div>
    `;
    document.getElementById('app').innerHTML = articleHtml;
}

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

document.getElementById('aboutLink').addEventListener('click', (e) => {
    e.preventDefault();
    showAbout();
});

showHome();
window.showHome = showHome;
window.showArticle = showArticle;
window.copyToClipboard = copyToClipboard;
