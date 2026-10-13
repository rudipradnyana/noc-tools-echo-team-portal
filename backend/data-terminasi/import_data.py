import os

import pandas as pd
import mysql.connector


csv_path = os.getenv("DATA_TERMINASI_CSV", "data_terminasi.csv")
connection = mysql.connector.connect(
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", "3306")),
    user=os.getenv("DB_USER", "labnoc"),
    password=os.getenv("DB_PASSWORD", ""),
    database=os.getenv("DB_NAME", "terminasi_db"),
)
cursor = connection.cursor()
data = pd.read_csv(csv_path, delimiter=";", on_bad_lines="skip")

for _, row in data.iterrows():
    cursor.execute(
        """
        INSERT INTO network_config (hostid, hostname, ip_loopback, port)
        VALUES (%s, %s, %s, %s)
        """,
        (row["hostid"], row["hostname"], row["ip_loopback"], row["port"]),
    )

connection.commit()
cursor.close()
connection.close()
print(f"Imported {len(data)} rows from {csv_path}")
