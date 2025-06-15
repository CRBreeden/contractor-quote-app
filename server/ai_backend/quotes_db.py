# server/ai_backend/quotes_db.py

import sqlite3
import json
from datetime import datetime

DB_FILE = "quotes.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quoteName TEXT NOT NULL,
            dateCreated TEXT NOT NULL,
            data TEXT NOT NULL,
            user_id INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def save_quote_for_user(quoteName, quoteData, user_id):
    init_db()
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        INSERT INTO quotes (quoteName, dateCreated, data, user_id)
        VALUES (?, ?, ?, ?)
    ''', (quoteName, datetime.now().isoformat(), json.dumps(quoteData), user_id))
    conn.commit()
    conn.close()

def get_quotes_for_user(user_id):
    init_db()
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT id, quoteName, dateCreated, data FROM quotes WHERE user_id = ? ORDER BY id DESC', (user_id,))
    rows = c.fetchall()
    conn.close()
    return [
        {
            "quoteId": row[0],
            "quoteName": row[1],
            "dateCreated": row[2],
            "data": json.loads(row[3])
        }
        for row in rows
    ]
