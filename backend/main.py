from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import date
from database import get_connection
from psycopg.errors import ForeignKeyViolation

app = FastAPI(title="Gaming Leaderboard System")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
class PlayerCreate(BaseModel):
    code: str
    dob: Optional[date] = None
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    skill_level: Optional[str] = None
    acc_id: Optional[int] = None


class PlayerUpdate(BaseModel):
    code: Optional[str] = None
    dob: Optional[date] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    skill_level: Optional[str] = None
    acc_id: Optional[int] = None


class GameCreate(BaseModel):
    name: Optional[str] = None
    developer: str
    release_date: Optional[date] = None
    max_players: int = Field(gt=0)
    genre: str


class GameUpdate(BaseModel):
    name: Optional[str] = None
    developer: Optional[str] = None
    release_date: Optional[date] = None
    max_players: Optional[int] = Field(default=None, gt=0)
    genre: Optional[str] = None


class TeamCreate(BaseModel):
    tag: str
    team_name: str
    state: Optional[str] = None
    city: Optional[str] = None
    street: Optional[str] = None
    country_code: str


class TeamUpdate(BaseModel):
    tag: Optional[str] = None
    team_name: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    street: Optional[str] = None
    country_code: Optional[str] = None


class MatchCreate(BaseModel):
    status: Literal["Scheduled", "Ongoing", "Completed", "Cancelled"] = "Scheduled"
    score: Optional[int] = None
    duration: Optional[int] = Field(default=None, ge=0)
    result: Optional[str] = None
    total_matches: Optional[int] = Field(default=None, ge=0)


class MatchUpdate(BaseModel):
    status: Optional[Literal["Scheduled", "Ongoing", "Completed", "Cancelled"]] = None
    score: Optional[int] = None
    duration: Optional[int] = Field(default=None, ge=0)
    result: Optional[str] = None
    total_matches: Optional[int] = Field(default=None, ge=0)

class QueryRequest(BaseModel):
    query: str


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

@app.post("/players", status_code=201)
def create_player(player: PlayerCreate):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO player (
                    code,
                    dob,
                    first_name,
                    middle_name,
                    last_name,
                    skill_level,
                    acc_id
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING
                    player_id,
                    code,
                    dob,
                    first_name,
                    middle_name,
                    last_name,
                    skill_level,
                    acc_id;
            """, (
                player.code,
                player.dob,
                player.first_name,
                player.middle_name,
                player.last_name,
                player.skill_level,
                player.acc_id
            ))

            return cur.fetchone()

@app.patch("/players/{player_id}")
@app.put("/players/{player_id}")
def update_player(player_id: int, player: PlayerUpdate):
    updates = player.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update"
        )

    allowed_fields = {
        "code",
        "dob",
        "first_name",
        "middle_name",
        "last_name",
        "skill_level",
        "acc_id"
    }

    updates = {
        field: value
        for field, value in updates.items()
        if field in allowed_fields
    }

    set_clause = ", ".join(
        f"{field} = %s" for field in updates
    )

    values = list(updates.values())
    values.append(player_id)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                UPDATE player
                SET {set_clause}
                WHERE player_id = %s
                RETURNING
                    player_id,
                    code,
                    dob,
                    first_name,
                    middle_name,
                    last_name,
                    skill_level,
                    acc_id;
                """,
                values
            )

            updated_player = cur.fetchone()

    if updated_player is None:
        raise HTTPException(
            status_code=404,
            detail="Player not found"
        )

    return updated_player

@app.delete("/players/{player_id}")
def delete_player(player_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM player
                WHERE player_id = %s
                RETURNING player_id;
            """, (player_id,))

            deleted_player = cur.fetchone()

    if deleted_player is None:
        raise HTTPException(
            status_code=404,
            detail="Player not found"
        )

    return {
        "message": "Player deleted successfully",
        "player_id": deleted_player["player_id"]
    }

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

@app.post("/games", status_code=201)
def create_game(game: GameCreate):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO game (
                    name,
                    developer,
                    release_date,
                    max_players,
                    genre
                )
                VALUES (%s, %s, %s, %s, %s)
                RETURNING
                    game_id,
                    name,
                    developer,
                    release_date,
                    max_players,
                    genre;
            """, (
                game.name,
                game.developer,
                game.release_date,
                game.max_players,
                game.genre
            ))

            return cur.fetchone()

@app.patch("/games/{game_id}")
@app.put("/games/{game_id}")
def update_game(game_id: int, game: GameUpdate):
    updates = game.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update"
        )

    allowed_fields = {
        "name",
        "developer",
        "release_date",
        "max_players",
        "genre"
    }

    updates = {
        field: value
        for field, value in updates.items()
        if field in allowed_fields
    }

    set_clause = ", ".join(
        f"{field} = %s" for field in updates
    )

    values = list(updates.values())
    values.append(game_id)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                UPDATE game
                SET {set_clause}
                WHERE game_id = %s
                RETURNING
                    game_id,
                    name,
                    developer,
                    release_date,
                    max_players,
                    genre;
                """,
                values
            )

            updated_game = cur.fetchone()

    if updated_game is None:
        raise HTTPException(
            status_code=404,
            detail="Game not found"
        )

    return updated_game

@app.delete("/games/{game_id}")
def delete_game(game_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM game
                WHERE game_id = %s
                RETURNING game_id;
            """, (game_id,))

            deleted_game = cur.fetchone()

    if deleted_game is None:
        raise HTTPException(
            status_code=404,
            detail="Game not found"
        )

    return {
        "message": "Game deleted successfully",
        "game_id": deleted_game["game_id"]
    }

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

@app.post("/teams", status_code=201)
def create_team(team: TeamCreate):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO team (
                    tag,
                    team_name,
                    state,
                    city,
                    street,
                    country_code
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING
                    team_id,
                    tag,
                    team_name,
                    state,
                    city,
                    street,
                    country_code;
            """, (
                team.tag,
                team.team_name,
                team.state,
                team.city,
                team.street,
                team.country_code
            ))

            return cur.fetchone()

@app.patch("/teams/{team_id}")
@app.put("/teams/{team_id}")
def update_team(team_id: int, team: TeamUpdate):
    updates = team.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update"
        )

    allowed_fields = {
        "tag",
        "team_name",
        "state",
        "city",
        "street",
        "country_code"
    }

    updates = {
        field: value
        for field, value in updates.items()
        if field in allowed_fields
    }

    set_clause = ", ".join(
        f"{field} = %s" for field in updates
    )

    values = list(updates.values())
    values.append(team_id)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                UPDATE team
                SET {set_clause}
                WHERE team_id = %s
                RETURNING
                    team_id,
                    tag,
                    team_name,
                    state,
                    city,
                    street,
                    country_code;
                """,
                values
            )

            updated_team = cur.fetchone()

    if updated_team is None:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    return updated_team

@app.delete("/teams/{team_id}")
def delete_team(team_id: int):
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    DELETE FROM team
                    WHERE team_id = %s
                    RETURNING team_id;
                """, (team_id,))

                deleted_team = cur.fetchone()

        if deleted_team is None:
            raise HTTPException(
                status_code=404,
                detail="Team not found"
            )

        return {
            "message": "Team deleted successfully",
            "team_id": deleted_team["team_id"]
        }

    except ForeignKeyViolation:
        raise HTTPException(
            status_code=409,
            detail="Cannot delete this team because it is assigned to a professional player"
        )

@app.get("/platforms")
def get_platforms():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    plat_id,
                    platform_name,
                    released,
                    manufacturer
                FROM platform
                ORDER BY plat_id;
            """)
            return cur.fetchall()


@app.get("/platforms/{platform_id}")
def get_platform(platform_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    plat_id,
                    platform_name,
                    released,
                    manufacturer
                FROM platform
                WHERE plat_id = %s;
            """, (platform_id,))

            platform = cur.fetchone()

    if platform is None:
        raise HTTPException(
            status_code=404,
            detail="Platform not found"
        )

    return platform


@app.get("/rewards")
def get_rewards():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    r.reward_id,
                    r.rtype,
                    r.acc_id,
                    rt.expirydate
                FROM reward r
                LEFT JOIN reward_type rt
                    ON r.rtype = rt.rtype
                ORDER BY r.reward_id;
            """)
            return cur.fetchall()


@app.get("/rewards/{reward_id}")
def get_reward(reward_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    r.reward_id,
                    r.rtype,
                    r.acc_id,
                    rt.expirydate
                FROM reward r
                LEFT JOIN reward_type rt
                    ON r.rtype = rt.rtype
                WHERE r.reward_id = %s;
            """, (reward_id,))

            reward = cur.fetchone()

    if reward is None:
        raise HTTPException(
            status_code=404,
            detail="Reward not found"
        )

    return reward


@app.get("/achievements")
def get_achievements():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    pa.ach_id,
                    pa.category,
                    pa.points,
                    pa.player_id,
                    pa.reward_id,
                    p.code AS player_tag,
                    CONCAT(p.first_name, ' ', p.last_name) AS player_name,
                    r.rtype AS reward_name,
                    rt.expirydate AS reward_expiry
                FROM player_achievement pa
                JOIN player p
                    ON pa.player_id = p.player_id
                LEFT JOIN reward r
                    ON pa.reward_id = r.reward_id
                LEFT JOIN reward_type rt
                    ON r.rtype = rt.rtype
                ORDER BY pa.ach_id;
            """)
            return cur.fetchall()


@app.get("/achievements/{achievement_id}")
def get_achievement(achievement_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    pa.ach_id,
                    pa.category,
                    pa.points,
                    pa.player_id,
                    pa.reward_id,
                    p.code AS player_tag,
                    CONCAT(p.first_name, ' ', p.last_name) AS player_name,
                    r.rtype AS reward_name,
                    rt.expirydate AS reward_expiry
                FROM player_achievement pa
                JOIN player p
                    ON pa.player_id = p.player_id
                LEFT JOIN reward r
                    ON pa.reward_id = r.reward_id
                LEFT JOIN reward_type rt
                    ON r.rtype = rt.rtype
                WHERE pa.ach_id = %s;
            """, (achievement_id,))

            achievement = cur.fetchone()

    if achievement is None:
        raise HTTPException(
            status_code=404,
            detail="Achievement not found"
        )

    return achievement

@app.get("/leaderboards")
def get_leaderboards():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    lb_id,
                    ltype,
                    last_updated,
                    ranking,
                    total_participant
                FROM leaderboard
                ORDER BY lb_id;
            """)
            return cur.fetchall()


@app.get("/leaderboards/{leaderboard_id}/rankings")
def get_leaderboard_rankings(leaderboard_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    mps.match_id,
                    mps.player_id,
                    p.code AS player_code,
                    CONCAT(p.first_name, ' ', p.last_name) AS player_name,
                    p.skill_level,
                    mps.score,
                    mps.wins,
                    mps.kills,
                    mps.deaths,
                    mps.assists,
                    ROUND(mps.kd_ratio, 2) AS kd_ratio,
                    m.result AS match_result
                FROM match_player_stats mps
                JOIN player p
                    ON mps.player_id = p.player_id
                JOIN "match" m
                    ON mps.match_id = m.match_id
                WHERE mps.lb_id = %s
                ORDER BY mps.score DESC;
            """, (leaderboard_id,))

            rankings = cur.fetchall()

    return rankings
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

@app.get("/stats/summary")
def get_dashboard_summary():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    (SELECT COUNT(*) FROM player) AS total_players,
                    (SELECT COUNT(*) FROM game) AS total_games,
                    (SELECT COUNT(*) FROM "match") AS total_matches,
                    (SELECT COUNT(*) FROM team) AS total_teams,
                    (SELECT COUNT(*) FROM leaderboard) AS total_leaderboards,
                    COALESCE(SUM(kills), 0) AS total_kills,
                    COALESCE(SUM(score), 0) AS total_score
                FROM match_player_stats;
            """)
            summary = cur.fetchone()

    return summary
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

@app.post("/matches", status_code=201)
def create_match(match: MatchCreate):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO "match" (
                    status,
                    score,
                    duration,
                    result,
                    total_matches
                )
                VALUES (%s, %s, %s, %s, %s)
                RETURNING
                    match_id,
                    status,
                    score,
                    duration,
                    result,
                    total_matches;
            """, (
                match.status,
                match.score,
                match.duration,
                match.result,
                match.total_matches
            ))

            return cur.fetchone()

@app.patch("/matches/{match_id}")
@app.put("/matches/{match_id}")
def update_match(match_id: int, match: MatchUpdate):
    updates = match.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update"
        )

    allowed_fields = {
        "status",
        "score",
        "duration",
        "result",
        "total_matches"
    }

    updates = {
        field: value
        for field, value in updates.items()
        if field in allowed_fields
    }

    set_clause = ", ".join(
        f"{field} = %s" for field in updates
    )

    values = list(updates.values())
    values.append(match_id)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                UPDATE "match"
                SET {set_clause}
                WHERE match_id = %s
                RETURNING
                    match_id,
                    status,
                    score,
                    duration,
                    result,
                    total_matches;
                """,
                values
            )

            updated_match = cur.fetchone()

    if updated_match is None:
        raise HTTPException(
            status_code=404,
            detail="Match not found"
        )

    return updated_match

@app.delete("/matches/{match_id}")
def delete_match(match_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM "match"
                WHERE match_id = %s
                RETURNING match_id;
            """, (match_id,))

            deleted_match = cur.fetchone()

    if deleted_match is None:
        raise HTTPException(
            status_code=404,
            detail="Match not found"
        )

    return {
        "message": "Match deleted successfully",
        "match_id": deleted_match["match_id"]
    }

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

@app.post("/query")
def execute_query(request_data: QueryRequest):
    raw_sql = request_data.query.strip()

    if not raw_sql:
        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty."
        )

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(raw_sql)

            if cur.description is not None:
                rows = cur.fetchall()

                columns = [
                    column.name
                    for column in cur.description
                ]

                return {
                    "columns": columns,
                    "rows": rows,
                    "rowCount": len(rows)
                }

            return {
                "columns": [],
                "rows": [],
                "rowCount": cur.rowcount
            }