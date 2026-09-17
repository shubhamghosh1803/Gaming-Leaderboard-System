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
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
class PlayerCreate(BaseModel):
    player_id: Optional[int] = None
    code: str
    dob: Optional[date] = None
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    skill_level: Optional[str] = None
    acc_id: Optional[int] = None
    email: Optional[str] = None
    player_type: Optional[str] = None
    team_id: Optional[int] = None
    salary: Optional[float] = None
    rank: Optional[str] = None
    pref_score: Optional[float] = None


class PlayerUpdate(BaseModel):
    code: Optional[str] = None
    dob: Optional[date] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    skill_level: Optional[str] = None
    acc_id: Optional[int] = None
    email: Optional[str] = None
    player_type: Optional[str] = None
    team_id: Optional[int] = None
    salary: Optional[float] = None
    rank: Optional[str] = None
    pref_score: Optional[float] = None


class GameCreate(BaseModel):
    game_id: Optional[int] = None
    name: Optional[str] = None
    developer: str
    release_date: Optional[date] = None
    max_players: int = Field(gt=0)
    genre: str
    featured_player_id: Optional[int] = None


class GameUpdate(BaseModel):
    name: Optional[str] = None
    developer: Optional[str] = None
    release_date: Optional[date] = None
    max_players: Optional[int] = Field(default=None, gt=0)
    genre: Optional[str] = None
    featured_player_id: Optional[int] = None


class TeamCreate(BaseModel):
    team_id: Optional[int] = None
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
    match_id: Optional[int] = None
    status: Literal["Scheduled", "Ongoing", "Completed", "Cancelled"] = "Scheduled"
    score: Optional[str] = None
    duration: Optional[int] = Field(default=None, ge=0)
    result: Optional[str] = None
    total_matches: Optional[int] = Field(default=None, ge=0)


class MatchUpdate(BaseModel):
    status: Optional[Literal["Scheduled", "Ongoing", "Completed", "Cancelled"]] = None
    score: Optional[str] = None
    duration: Optional[int] = Field(default=None, ge=0)
    result: Optional[str] = None
    total_matches: Optional[int] = Field(default=None, ge=0)


class LeaderboardCreate(BaseModel):
    lb_id: Optional[int] = None
    ltype: str
    ranking: Optional[int] = Field(default=1, gt=0)
    total_participant: Optional[int] = Field(default=0, ge=0)


class LeaderboardUpdate(BaseModel):
    ltype: Optional[str] = None
    ranking: Optional[int] = Field(default=None, gt=0)
    total_participant: Optional[int] = Field(default=None, ge=0)


class MatchPlayerStatsCreate(BaseModel):
    match_id: int
    player_id: int
    lb_id: Optional[int] = None
    wins: int = Field(default=0, ge=0)
    score: int = Field(default=0, ge=0)
    deaths: int = Field(default=0, ge=0)
    headshots: int = Field(default=0, ge=0)
    kills: int = Field(default=0, ge=0)
    assists: int = Field(default=0, ge=0)
    kd_ratio: Optional[float] = Field(default=None, ge=0)

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
                    p.player_id,
                    p.code,
                    p.dob,
                    p.first_name,
                    p.middle_name,
                    p.last_name,
                    p.skill_level,
                    p.acc_id,
                    a.email AS account_email,
                    pp.team_id,
                    pp.salary,
                    t.tag AS team_tag,
                    t.team_name,
                    cp.player_rank,
                    ca.professional_score
                FROM player p
                LEFT JOIN account a ON a.acc_id = p.acc_id
                LEFT JOIN professional_player pp ON pp.player_id = p.player_id
                LEFT JOIN team t ON t.team_id = pp.team_id
                LEFT JOIN competitive_player cp ON cp.player_id = p.player_id
                LEFT JOIN casual_player ca ON ca.player_id = p.player_id
                ORDER BY p.player_id;
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
                    p.acc_id,
                    a.email AS account_email,
                    pp.team_id,
                    pp.salary,
                    t.tag AS team_tag,
                    t.team_name,
                    cp.player_rank,
                    ca.professional_score
                FROM player p
                LEFT JOIN account a ON a.acc_id = p.acc_id
                LEFT JOIN professional_player pp ON pp.player_id = p.player_id
                LEFT JOIN team t ON t.team_id = pp.team_id
                LEFT JOIN competitive_player cp ON cp.player_id = p.player_id
                LEFT JOIN casual_player ca ON ca.player_id = p.player_id
                WHERE p.player_id = %s;
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
            if player.acc_id is not None:
                cur.execute("SELECT acc_id FROM account WHERE acc_id = %s", (player.acc_id,))
                if cur.fetchone() is None:
                    email = player.email or f"account-{player.acc_id}@local.test"
                    cur.execute("""
                        INSERT INTO account (acc_id, email, password_hash)
                        VALUES (%s, %s, %s)
                    """, (player.acc_id, email, "local-mvp"))

            cur.execute("""
                INSERT INTO player (
                    player_id,
                    code,
                    dob,
                    first_name,
                    middle_name,
                    last_name,
                    skill_level,
                    acc_id
                )
                VALUES (COALESCE(%s, nextval('player_player_id_seq')), %s, %s, %s, %s, %s, %s, %s)
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
                player.player_id,
                player.code,
                player.dob,
                player.first_name,
                player.middle_name,
                player.last_name,
                player.skill_level,
                player.acc_id
            ))
            created = cur.fetchone()
            if player.player_type == "Professional" and player.team_id is not None:
                cur.execute("""
                    INSERT INTO professional_player (player_id, team_id, salary)
                    VALUES (%s, %s, %s)
                """, (created["player_id"], player.team_id, player.salary or 0))
            return created

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

    base_updates = {
        field: value
        for field, value in updates.items()
        if field in allowed_fields
    }

    with get_connection() as conn:
        with conn.cursor() as cur:
            if player.acc_id is not None:
                cur.execute("SELECT acc_id FROM account WHERE acc_id = %s", (player.acc_id,))
                if cur.fetchone() is None:
                    email = player.email or f"account-{player.acc_id}@local.test"
                    cur.execute(
                        "INSERT INTO account (acc_id, email, password_hash) VALUES (%s, %s, %s)",
                        (player.acc_id, email, "local-mvp")
                    )
                elif player.email:
                    cur.execute(
                        "UPDATE account SET email = %s WHERE acc_id = %s",
                        (player.email.strip(), player.acc_id)
                    )

            if base_updates:
                set_clause = ", ".join(f"{field} = %s" for field in base_updates)
                values = list(base_updates.values()) + [player_id]
                cur.execute(
                    f"UPDATE player SET {set_clause} WHERE player_id = %s RETURNING player_id, code, dob, first_name, middle_name, last_name, skill_level, acc_id;",
                    values
                )
                updated_player = cur.fetchone()
            else:
                cur.execute("SELECT player_id, code, dob, first_name, middle_name, last_name, skill_level, acc_id FROM player WHERE player_id = %s", (player_id,))
                updated_player = cur.fetchone()

            if updated_player is not None and player.player_type is not None:
                cur.execute("DELETE FROM casual_player WHERE player_id = %s", (player_id,))
                cur.execute("DELETE FROM competitive_player WHERE player_id = %s", (player_id,))
                cur.execute("DELETE FROM professional_player WHERE player_id = %s", (player_id,))

                if player.player_type == "Casual":
                    cur.execute("INSERT INTO casual_player (player_id, professional_score) VALUES (%s, %s)", (player_id, player.pref_score or 0))
                elif player.player_type == "Competitive":
                    rank = (player.rank or "Unranked").strip()
                    cur.execute("INSERT INTO competitive_player (player_id, player_rank) VALUES (%s, %s)", (player_id, rank))
                elif player.player_type == "Professional":
                    if player.team_id is None:
                        raise HTTPException(status_code=400, detail="Team ID is required for professional players")
                    cur.execute("INSERT INTO professional_player (player_id, team_id, salary) VALUES (%s, %s, %s)", (player_id, player.team_id, player.salary or 0))

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
                    genre,
                    featured_player_id
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
                    genre,
                    featured_player_id
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
                    game_id,
                    name,
                    developer,
                    release_date,
                    max_players,
                    genre,
                    featured_player_id
                )
                VALUES (COALESCE(%s, nextval('game_game_id_seq')), %s, %s, %s, %s, %s, %s)
                RETURNING
                    game_id,
                    name,
                    developer,
                    release_date,
                    max_players,
                    genre,
                    featured_player_id;
            """, (
                game.game_id,
                game.name,
                game.developer,
                game.release_date,
                game.max_players,
                game.genre,
                game.featured_player_id
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
        "genre",
        "featured_player_id"
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
                SELECT country_code FROM country_info
                WHERE country_code = %s OR LOWER(country_name) = LOWER(%s)
                LIMIT 1
            """, (team.country_code, team.country_code))
            country = cur.fetchone()
            if country is None:
                raise HTTPException(status_code=400, detail="Country must match a registered country name or code")
            cur.execute("""
                INSERT INTO team (
                    team_id,
                    tag,
                    team_name,
                    state,
                    city,
                    street,
                    country_code
                )
                VALUES (COALESCE(%s, nextval('team_team_id_seq')), %s, %s, %s, %s, %s, %s)
                RETURNING
                    team_id,
                    tag,
                    team_name,
                    state,
                    city,
                    street,
                    country_code;
            """, (
                team.team_id,
                team.tag,
                team.team_name,
                team.state,
                team.city,
                team.street,
                country["country_code"]
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
                    COALESCE(a.email, 'Account #' || r.acc_id || ' (deleted)') AS account_email,
                    rt.expiry_date AS expiry_date
                FROM reward r
                LEFT JOIN reward_type rt
                    ON r.rtype = rt.rtype
                LEFT JOIN account a
                    ON a.acc_id = r.acc_id
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
                    COALESCE(a.email, 'Account #' || r.acc_id || ' (deleted)') AS account_email,
                    rt.expiry_date AS expiry_date
                FROM reward r
                LEFT JOIN reward_type rt
                    ON r.rtype = rt.rtype
                LEFT JOIN account a
                    ON a.acc_id = r.acc_id
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
                    rt.expiry_date AS reward_expiry
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


@app.post("/leaderboards", status_code=201)
def create_leaderboard(leaderboard: LeaderboardCreate):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO leaderboard (lb_id, ltype, ranking, total_participant)
                VALUES (COALESCE(%s, nextval('leaderboard_lb_id_seq')), %s, %s, %s)
                RETURNING lb_id, ltype, last_updated, ranking, total_participant;
            """, (
                leaderboard.lb_id,
                leaderboard.ltype.strip(),
                leaderboard.ranking,
                leaderboard.total_participant
            ))
            return cur.fetchone()


@app.put("/leaderboards/{leaderboard_id}")
@app.patch("/leaderboards/{leaderboard_id}")
def update_leaderboard(leaderboard_id: int, leaderboard: LeaderboardUpdate):
    updates = leaderboard.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields provided for update")
    if "ltype" in updates:
        updates["ltype"] = updates["ltype"].strip()
    set_clause = ", ".join(f"{field} = %s" for field in updates)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                UPDATE leaderboard
                SET {set_clause}, last_updated = CURRENT_TIMESTAMP
                WHERE lb_id = %s
                RETURNING lb_id, ltype, last_updated, ranking, total_participant;
                """,
                list(updates.values()) + [leaderboard_id]
            )
            updated = cur.fetchone()
    if updated is None:
        raise HTTPException(status_code=404, detail="Leaderboard not found")
    return updated


@app.delete("/leaderboards/{leaderboard_id}")
def delete_leaderboard(leaderboard_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM leaderboard WHERE lb_id = %s RETURNING lb_id", (leaderboard_id,))
            deleted = cur.fetchone()
    if deleted is None:
        raise HTTPException(status_code=404, detail="Leaderboard not found")
    return {"message": "Leaderboard deleted successfully", "lb_id": deleted["lb_id"]}


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
                    mps.headshots,
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
                    p.code,
                    p.dob,
                    p.first_name,
                    p.middle_name,
                    p.last_name,
                    p.skill_level,
                    p.last_name,
                    p.skill_level,
                    p.acc_id,
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
                ORDER BY match_id DESC;
            """)
            return cur.fetchall()


@app.post("/match-stats", status_code=201)
def create_match_player_stats(stats: MatchPlayerStatsCreate):
    kd_ratio = stats.kd_ratio
    if kd_ratio is None:
        kd_ratio = round(stats.kills / stats.deaths, 2) if stats.deaths else float(stats.kills)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO match_player_stats (
                    match_id, player_id, lb_id, wins, score, deaths,
                    headshots, kills, assists, kd_ratio
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING match_id, player_id, lb_id, wins, score, deaths,
                          headshots, kills, assists, kd_ratio;
            """, (
                stats.match_id, stats.player_id, stats.lb_id, stats.wins,
                stats.score, stats.deaths, stats.headshots, stats.kills,
                stats.assists, kd_ratio
            ))
            return cur.fetchone()


@app.get("/match-stats/{match_id}")
def get_match_player_stats(match_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT mps.match_id, mps.player_id, p.code AS player_code,
                       mps.lb_id, mps.wins, mps.score, mps.deaths,
                       mps.headshots, mps.kills, mps.assists, mps.kd_ratio
                FROM match_player_stats mps
                JOIN player p ON p.player_id = mps.player_id
                WHERE mps.match_id = %s
                ORDER BY mps.score DESC;
            """, (match_id,))
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
                    match_id,
                    status,
                    score,
                    duration,
                    result,
                    total_matches
                )
                VALUES (COALESCE(%s, nextval('match_match_id_seq')), %s, %s, %s, %s, %s)
                RETURNING
                    match_id,
                    status,
                    score,
                    duration,
                    result,
                    total_matches;
            """, (
                match.match_id,
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