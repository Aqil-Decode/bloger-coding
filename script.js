// script.js
const API_URL = 'http://localhost:3000/api';

// Background Animation
function createBackgroundAnimation() {
    const bgAnimation = document.getElementById('bgAnimation');
    if (!bgAnimation) return;
    
    const colors = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#3b82f6'];
    
    for (let i = 0; i < 25; i++) {
        const circle = document.createElement('div');
        circle.className = 'circle';
        const size = Math.random() * 100 + 30;
        circle.style.width = size + 'px';
        circle.style.height = size + 'px';
        circle.style.left = Math.random() * 100 + '%';
        circle.style.top = Math.random() * 100 + '%';
        circle.style.animationDelay = Math.random() * 20 + 's';
        circle.style.animationDuration = Math.random() * 15 + 10 + 's';
        circle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        circle.style.opacity = Math.random() * 0.15 + 0.05;
        bgAnimation.appendChild(circle);
    }
}

// Inisialisasi slider captcha
function initCaptcha() {
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderThumb = document.getElementById('sliderThumb');
    const sliderText = document.getElementById('sliderText');
    const captchaStatus = document.getElementById('captchaStatus');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!sliderTrack) return;
    
    let isDragging = false;
    let startX = 0;
    let currentLeft = 0;
    let verified = false;
    
    const trackWidth = sliderTrack.offsetWidth;
    const thumbWidth = 56;
    const maxLeft = trackWidth - thumbWidth;
    
    const onMouseMove = (e) => {
        if (!isDragging) return;
        
        let newLeft = currentLeft + (e.clientX - startX);
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        sliderThumb.style.left = newLeft + 'px';
        
        if (newLeft >= maxLeft - 8 && !verified) {
            verified = true;
            sliderTrack.classList.add('verified');
            sliderText.textContent = '✓ Terverifikasi!';
            captchaStatus.innerHTML = '<i class="fas fa-check-circle"></i> Verifikasi berhasil!';
            captchaStatus.classList.add('verified');
            submitBtn.disabled = false;
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    };
    
    const onMouseUp = () => {
        if (!verified && isDragging) {
            sliderThumb.style.left = '0px';
        }
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };
    
    sliderThumb.addEventListener('mousedown', (e) => {
        if (verified) return;
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
        currentLeft = parseInt(sliderThumb.style.left) || 0;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    
    // Touch events untuk mobile
    sliderThumb.addEventListener('touchstart', (e) => {
        if (verified) return;
        e.preventDefault();
        isDragging = true;
        startX = e.touches[0].clientX;
        currentLeft = parseInt(sliderThumb.style.left) || 0;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging || verified) return;
        e.preventDefault();
        let newLeft = currentLeft + (e.touches[0].clientX - startX);
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        sliderThumb.style.left = newLeft + 'px';
        
        if (newLeft >= maxLeft - 8 && !verified) {
            verified = true;
            sliderTrack.classList.add('verified');
            sliderText.textContent = '✓ Terverifikasi!';
            captchaStatus.innerHTML = '<i class="fas fa-check-circle"></i> Verifikasi berhasil!';
            captchaStatus.classList.add('verified');
            submitBtn.disabled = false;
            isDragging = false;
        }
    });
    
    document.addEventListener('touchend', () => {
        if (!verified && isDragging) {
            sliderThumb.style.left = '0px';
        }
        isDragging = false;
    });
}

// Tampilkan alert
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Handle registrasi
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            showAlert('Password dan konfirmasi password tidak cocok', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showAlert(data.message, 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                showAlert(data.message, 'error');
            }
        } catch (err) {
            showAlert('Terjadi kesalahan, pastikan server berjalan', 'error');
        }
    });
}

// Handle login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                showAlert(data.message, 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showAlert(data.message, 'error');
            }
        } catch (err) {
            showAlert('Terjadi kesalahan, pastikan server berjalan', 'error');
        }
    });
}

// Inisialisasi
createBackgroundAnimation();
initCaptcha();
