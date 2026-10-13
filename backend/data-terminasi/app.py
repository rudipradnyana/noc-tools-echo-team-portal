import os

import mysql.connector
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "labnoc"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "terminasi_db"),
}


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = os.getenv("FRONTEND_ORIGIN", "*")
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


@app.route("/api/data-terminasi", methods=["GET"])
def api_data_terminasi():
    service_id = request.args.get("service_id", "").strip()
    if not service_id:
        return jsonify({"error": "service_id wajib diisi", "results": []}), 400

    connection = None
    cursor = None
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT hostname, ip_loopback, port
            FROM network_config
            WHERE port LIKE %s
            """,
            (f"%{service_id}%",),
        )
        return jsonify({"results": cursor.fetchall()})
    except mysql.connector.Error as error:
        return jsonify({"error": f"Database error: {error}", "results": []}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"service": "data-terminasi", "status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5009")), debug=True)
