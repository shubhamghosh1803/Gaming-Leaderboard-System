import psycopg
from psycopg.rows import dict_row

DATABASE_URL = (
    "postgresql://postgres:1234@localhost:5432/gaming_leaderboard"
)


def get_connection():
    return psycopg.connect(
        DATABASE_URL,
        row_factory=dict_row
    )