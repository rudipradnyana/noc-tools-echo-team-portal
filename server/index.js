import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS ok');
    res.json({ ok: true, database: 'connected', result: rows });
  } catch (error) {
    res.status(500).json({ ok: false, database: 'disconnected', error: error.message });
  }
});

// 1. REGISTER USER (Status: pending)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, dan role wajib diisi.',
      });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanFullName = String(fullName || cleanUsername).trim();
    const cleanRole = String(role).trim().toLowerCase();

    const allowedRoles = ['admin', 'regular', 'analis', 'ea', 'tdm', 'manager', 'mod'];
    if (!allowedRoles.includes(cleanRole)) {
      return res.status(400).json({
        success: false,
        message: `Role tidak valid. Pilihan: ${allowedRoles.join(', ')}`,
      });
    }

    // Check existing
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [cleanUsername]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Username '${cleanUsername}' sudah terdaftar. Silakan gunakan username lain.`,
      });
    }

    // Insert user with status pending
    const [result] = await pool.query(
      'INSERT INTO users (username, password, full_name, role, status) VALUES (?, ?, ?, ?, ?)',
      [cleanUsername, password, cleanFullName, cleanRole, 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan (ACC) dari Admin.',
      userId: result.insertId,
      status: 'pending',
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat mendaftar.', error: error.message });
  }
});

// 2. LOGIN USER
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi.',
      });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const [users] = await pool.query(
      'SELECT id, username, password, full_name, role, status FROM users WHERE username = ?',
      [cleanUsername]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Username tidak ditemukan.',
      });
    }

    const user = users[0];

    // Simple password check (matches stored password)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Password salah.',
      });
    }

    // Status check
    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        isPending: true,
        message: 'Akun Anda sedang MENUNGGU PERSETUJUAN (ACC) dari Admin. Silakan hubungi Admin.',
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        isRejected: true,
        message: 'Pendaftaran akun Anda DITOLAK oleh Admin.',
      });
    }

    // Fetch user favorites
    const [favRows] = await pool.query(
      'SELECT tool_id FROM user_favorite_tools WHERE user_id = ?',
      [user.id]
    );
    const favoriteToolIds = favRows.map((r) => r.tool_id);

    res.json({
      success: true,
      user: {
        id: String(user.id),
        username: user.username,
        name: user.full_name,
        role: user.role,
        status: user.status,
      },
      favorites: favoriteToolIds,
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Gagal melakukan login.', error: error.message });
  }
});

// 3. GET ALL USERS (Untuk Admin Dashboard - Persetujuan Akun)
app.get('/api/users', async (_req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, full_name, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data user.', error: error.message });
  }
});

// 4. APPROVE / REJECT USER (Admin ACC)
app.patch('/api/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }

    const [result] = await pool.query(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    const [updated] = await pool.query(
      'SELECT id, username, full_name, role, status FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: `Status user berhasil diubah menjadi '${status}'.`,
      user: updated[0],
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status user.', error: error.message });
  }
});

// 5. GET USER FAVORITE TOOLS
app.get('/api/users/:userId/favorites', async (req, res) => {
  try {
    const { userId } = req.params;
    const [favRows] = await pool.query(
      'SELECT tool_id FROM user_favorite_tools WHERE user_id = ?',
      [userId]
    );
    res.json({
      success: true,
      userId,
      favorites: favRows.map((r) => r.tool_id),
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil tool favorit.', error: error.message });
  }
});

// 6. TOGGLE FAVORITE TOOL
app.post('/api/users/:userId/favorites/toggle', async (req, res) => {
  try {
    const { userId } = req.params;
    const { toolId } = req.body;

    if (!toolId) {
      return res.status(400).json({ success: false, message: 'toolId wajib diberikan.' });
    }

    // Check if favorite already exists
    const [existing] = await pool.query(
      'SELECT id FROM user_favorite_tools WHERE user_id = ? AND tool_id = ?',
      [userId, toolId]
    );

    let isFavorite = false;
    if (existing.length > 0) {
      // Remove
      await pool.query('DELETE FROM user_favorite_tools WHERE id = ?', [existing[0].id]);
      isFavorite = false;
    } else {
      // Add
      await pool.query(
        'INSERT INTO user_favorite_tools (user_id, tool_id) VALUES (?, ?)',
        [userId, toolId]
      );
      isFavorite = true;
    }

    // Return all latest favorites for this user
    const [allFavs] = await pool.query(
      'SELECT tool_id FROM user_favorite_tools WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      isFavorite,
      favorites: allFavs.map((r) => r.tool_id),
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah favorit.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API NOC Portal aktif di http://localhost:${PORT}`);
});
