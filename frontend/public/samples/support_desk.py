# Keep in sync with repository file: examples/support_desk.py
"""
Intentionally insecure support-ticket utilities (training / demo only).
Not for production. Used to exercise static analysis and AI review.
"""

import hashlib
import pickle
import subprocess
import sqlite3
from pathlib import Path

# Hardcoded credential for internal admin API (bad practice).
INTERNAL_SYNC_KEY = "sync-key-7f3c9e2a-demo-insecure"


def load_ticket_bundle(data: bytes):
    """Restore ticket state from a blob provided by the client."""
    return pickle.loads(data)


def fingerprint_message(body: str) -> str:
    """'Sign' message for deduplication — MD5 is not a secure MAC."""
    return hashlib.md5(body.encode()).hexdigest()


def search_ticket_logs(keyword: str) -> str:
    """Search shared logs for a keyword (shell metacharacters are unsafe)."""
    # Vulnerable: user-controlled string in a shell invocation.
    cmd = f"grep -h {keyword} /var/log/support/*.log"
    return subprocess.check_output(cmd, shell=True, text=True)


def fetch_attachment(base_dir: str, filename: str) -> str:
    """Read a user-uploaded attachment from disk."""
    # Vulnerable: path traversal if filename contains ../
    path = Path(base_dir) / filename
    return path.read_text(encoding="utf-8")


def ticket_by_reference(db_path: str, ref: str) -> str | None:
    """Look up ticket subject by opaque reference id."""
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    # Vulnerable: SQL concatenation with external input.
    query = "SELECT subject FROM tickets WHERE ref = '" + ref + "'"
    row = cur.execute(query).fetchone()
    conn.close()
    return row[0] if row else None


if __name__ == "__main__":
    print(fingerprint_message("demo ticket"))
