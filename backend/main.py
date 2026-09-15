from fastapi import FastAPI, HTTPException
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

@app.get("/players")
def get_players():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    player_id,
                    code,
                    dob,
                    first_name,
                    middle_name,
                    last_name,
                    skill_level,
                    acc_id
                FROM player
                ORDER BY player_id;
            """)
            return cur.fetchall()


@app.get("/players/{player_id}")
def get_player(player_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    player_id,
                    code,
                    dob,
                    first_name,
                    middle_name,
                    last_name,
                    skill_level,
                    acc_id
                FROM player
                WHERE player_id = %s;
            """, (player_id,))

            player = cur.fetchone()

    if player is None:
        raise HTTPException(
            status_code=404,
            detail="Player not found"
        )

    return player

@app.get("/games")
def get_games():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    game_id,
                    name,
                    developer,
                    release_date,
                    max_players,
                    genre
                FROM game
                ORDER BY game_id;
            """)
            return cur.fetchall()


@app.get("/games/{game_id}")
def get_game(game_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    game_id,
                    name,
                    developer,
                    release_date,
                    max_players,
                    genre
                FROM game
                WHERE game_id = %s;
            """, (game_id,))

            game = cur.fetchone()

    if game is None:
        raise HTTPException(
            status_code=404,
            detail="Game not found"
        )

    return game

@app.get("/teams")
def get_teams():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    t.team_id,
                    t.tag,
                    t.team_name,
                    t.state,
                    t.city,
                    t.street,
                    c.country_name
                FROM team t
                JOIN country_info c
                    ON t.country_code = c.country_code
                ORDER BY t.team_id;
            """)
            return cur.fetchall()


@app.get("/teams/{team_id}")
def get_team(team_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    t.team_id,
                    t.tag,
                    t.team_name,
                    t.state,
                    t.city,
                    t.street,
                    c.country_name
                FROM team t
                JOIN country_info c
                    ON t.country_code = c.country_code
                WHERE t.team_id = %s;
            """, (team_id,))

            team = cur.fetchone()

    if team is None:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    return team


@app.get("/leaderboard")
def get_leaderboard():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    p.player_id,
                    p.first_name,
                    p.last_name,
                    SUM(mps.score) AS total_score,
                    SUM(mps.wins) AS total_wins,
                    SUM(mps.kills) AS total_kills,
                    SUM(mps.deaths) AS total_deaths
                FROM player p
                JOIN match_player_stats mps
                    ON p.player_id = mps.player_id
                GROUP BY
                    p.player_id,
                    p.first_name,
                    p.last_name
                ORDER BY total_score DESC;
            """)
            return cur.fetchall()

@app.get("/matches")
def get_matches():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    match_id,
                    status,
                    score,
                    duration,
                    result,
                    total_matches
                FROM "match"
                ORDER BY match_id;
            """)
            return cur.fetchall()


@app.get("/matches/{match_id}")
def get_match(match_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    match_id,
                    status,
                    score,
                    duration,
                    result,
                    total_matches
                FROM "match"
                WHERE match_id = %s;
            """, (match_id,))

            match = cur.fetchone()

    if match is None:
        raise HTTPException(
            status_code=404,
            detail="Match not found"
        )

    return match

@app.get("/players/{player_id}/statistics")
def get_player_statistics(player_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    p.player_id,
                    p.first_name,
                    p.last_name,
                    SUM(mps.wins) AS total_wins,
                    SUM(mps.score) AS total_score,
                    SUM(mps.kills) AS total_kills,
                    SUM(mps.deaths) AS total_deaths,
                    SUM(mps.assists) AS total_assists,
                    ROUND(AVG(mps.kd_ratio), 2) AS average_kd_ratio
                FROM player p
                JOIN match_player_stats mps
                    ON p.player_id = mps.player_id
                WHERE p.player_id = %s
                GROUP BY
                    p.player_id,
                    p.first_name,
                    p.last_name;
            """, (player_id,))

            statistics = cur.fetchone()

    if statistics is None:
        raise HTTPException(
            status_code=404,
            detail="Statistics not found for this player"
        )

    return statistics