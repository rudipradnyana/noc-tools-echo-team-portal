#!/bin/bash
# Script untuk setup database noc_portal_db di XAMPP MySQL Mac

MYSQL_BIN="/Applications/XAMPP/xamppfiles/bin/mysql"
SQL_FILE="$(cd "$(dirname "$0")" && pwd)/init.sql"

if [ ! -f "$MYSQL_BIN" ]; then
    echo "❌ Error: XAMPP MySQL tidak ditemukan di $MYSQL_BIN"
    exit 1
fi

echo "🔄 Menghubungkan ke MySQL XAMPP..."
"$MYSQL_BIN" -u root < "$SQL_FILE" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ SUKSES! Database 'noc_portal_db' dan tabel berhasil dibuat di XAMPP!"
    echo "📋 Verifikasi tabel:"
    "$MYSQL_BIN" -u root -e "USE noc_portal_db; SHOW TABLES;"
    echo "👥 Daftar User Awal:"
    "$MYSQL_BIN" -u root -e "USE noc_portal_db; SELECT id, username, full_name, role, status FROM users;"
else
    echo "⚠️ MySQL belum menyala atau tidak bisa dihubungi."
    echo "Silakan pastikan MySQL di XAMPP Manager sudah berstatus 'Running' (Hijau)."
fi
