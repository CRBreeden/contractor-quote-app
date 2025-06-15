# server/ai_backend/users_db.py

import sqlite3
import hashlib

conn = sqlite3.connect("users.db", check_same_thread=False)
cur = conn.cursor()

# Create table if not exists
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    agreed_to_terms BOOLEAN
)
""")
conn.commit()

def hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def create_user(name, email, password, agreed):
    try:
        cur.execute("INSERT INTO users (name, email, password, agreed_to_terms) VALUES (?, ?, ?, ?)",
                    (name, email, hash_pw(password), agreed))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False

def verify_user(email, password):
    cur.execute("SELECT password, agreed_to_terms FROM users WHERE email = ?", (email,))
    row = cur.fetchone()
    if not row:
        return None
    return {
        "valid": hash_pw(password) == row[0],
        "agreed": bool(row[1])
    }

def get_user_by_email(email):
    cur.execute("SELECT id, name FROM users WHERE email = ?", (email,))
    row = cur.fetchone()
    if row:
        return {"id": row[0], "name": row[1]}
    return None

def get_user_by_id(user_id):
    cur.execute("SELECT id, email FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    if row:
        return {"id": row[0], "email": row[1]}
    return None
