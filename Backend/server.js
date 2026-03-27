// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'codecanvas_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Path ke file database
const usersFile = path.join(__dirname, 'users.json');

// Baca data users dari file
function readUsers() {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Tulis data users ke file
function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Registrasi user baru
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
    }
    
    if (username.length < 3) {
        return res.status(400).json({ success: false, message: 'Username minimal 3 karakter' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });
    }
    
    const users = readUsers();
    
    // Cek apakah username sudah ada
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'Username sudah terdaftar' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Simpan user baru
    const newUser = {
        id: Date.now(),
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    writeUsers(users);
    
    res.json({ success: true, message: 'Registrasi berhasil! Silakan login.' });
});

// Login user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
    }
    
    const users = readUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
        return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
        return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
    
    // Buat token JWT
    const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: '7d' }
    );
    
    res.json({
        success: true,
        message: 'Login berhasil!',
        token,
        user: { username: user.username }
    });
});

// Verifikasi token (untuk cek session)
app.post('/api/verify', (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.json({ success: false, message: 'No token' });
    }
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ success: true, user: { username: decoded.username } });
    } catch (err) {
        res.json({ success: false, message: 'Invalid token' });
    }
});

// Logout (client side hapus token)
app.post('/api/logout', (req, res) => {
    res.json({ success: true, message: 'Logout berhasil' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Registrasi: http://localhost:${PORT}/register.html`);
    console.log(`Login: http://localhost:${PORT}/login.html`);
    console.log(`Blog: http://localhost:${PORT}/index.html (setelah login)`);
});
