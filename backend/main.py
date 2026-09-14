from fastapi import FastAPI
from database import get_connection

app = FastAPI(title="Gaming Leaderboard System")


@app.get("/")
def home():
    return {"message": "Gaming Leaderboard API is running"}


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Gaming Leaderboard API"
    }


@app.get("/db-test")
def database_test():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT version();")
            result = cur.fetchone()

    return {
        "database": "connected",
        "version": result["version"]
    }