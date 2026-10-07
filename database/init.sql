-- Inisialisasi Database NOC Tools & Echo Team Portal
CREATE DATABASE IF NOT EXISTS noc_portal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE noc_portal_db;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'regular', 'analis', 'ea', 'tdm', 'manager', 'asmen') NOT NULL DEFAULT 'regular',
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabel Favorite Tools (Relasi User dan Tools yang Difavoritkan)
CREATE TABLE IF NOT EXISTS user_favorite_tools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tool_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_tool UNIQUE (user_id, tool_id)
);

-- 3. Akun Admin Utama (Default)
INSERT INTO users (username, password, full_name, role, status)
VALUES 
    ('noc.admin', 'admin123', 'Administrator NOC', 'admin', 'approved')
ON DUPLICATE KEY UPDATE full_name='Administrator NOC', role='admin', status='approved';
