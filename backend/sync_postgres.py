from datetime import date, datetime
from decimal import Decimal

from database import get_connection
from neo4j_database import get_driver


TABLE_QUERIES = {
    "account": "SELECT * FROM account",
    "country_info": "SELECT * FROM country_info",
    "game": "SELECT * FROM game",
    "platform": "SELECT * FROM platform",
    "reward_type": "SELECT * FROM reward_type",
    "team": "SELECT * FROM team",
    "player": "SELECT * FROM player",
    "reward": "SELECT * FROM reward",
    "casual_player": "SELECT * FROM casual_player",
    "competitive_player": "SELECT * FROM competitive_player",
    "professional_player": "SELECT * FROM professional_player",
    "match": 'SELECT * FROM "match"',
    "leaderboard": "SELECT * FROM leaderboard",
    "represents_team": "SELECT * FROM represents_team",
    "represents_match": "SELECT * FROM represents_match",
    "represents_platform": "SELECT * FROM represents_platform",
    "player_achievement": "SELECT * FROM player_achievement",
    "match_player_stats": "SELECT * FROM match_player_stats",
    "account_email": "SELECT * FROM account_email",
}

NODE_TABLES = {
    "PGAccount": ("account", ("acc_id",)),
    "PGCountry": ("country_info", ("country_code",)),
    "PGGame": ("game", ("game_id",)),
    "PGPlatform": ("platform", ("plat_id",)),
    "PGRewardType": ("reward_type", ("rtype",)),
    "PGTeam": ("team", ("team_id",)),
    "PGPlayer": ("player", ("player_id",)),
    "PGReward": ("reward", ("reward_id",)),
    "PGMatch": ("match", ("match_id",)),
    "PGLeaderboard": ("leaderboard", ("lb_id",)),
    "PGAchievement": ("player_achievement", ("ach_id",)),
}

RELATIONSHIP_QUERIES = {
    "account_player": """
        UNWIND $rows AS row
        MATCH (p:PostgresMirror:PGPlayer {pg_key: row.player_key})
        MATCH (a:PostgresMirror:PGAccount {pg_key: row.account_key})
        MERGE (p)-[:HAS_ACCOUNT]->(a)
    """,
    "team_country": """
        UNWIND $rows AS row
        MATCH (t:PostgresMirror:PGTeam {pg_key: row.team_key})
        MATCH (c:PostgresMirror:PGCountry {pg_key: row.country_key})
        MERGE (t)-[:LOCATED_IN]->(c)
    """,
    "reward_type": """
        UNWIND $rows AS row
        MATCH (r:PostgresMirror:PGReward {pg_key: row.reward_key})
        MATCH (t:PostgresMirror:PGRewardType {pg_key: row.type_key})
        MERGE (r)-[:OF_TYPE]->(t)
    """,
    "reward_account": """
        UNWIND $rows AS row
        MATCH (r:PostgresMirror:PGReward {pg_key: row.reward_key})
        MATCH (a:PostgresMirror:PGAccount {pg_key: row.account_key})
        MERGE (r)-[:OWNED_BY]->(a)
    """,
    "professional_team": """
        UNWIND $rows AS row
        MATCH (p:PostgresMirror:PGPlayer {pg_key: row.player_key})
        MATCH (t:PostgresMirror:PGTeam {pg_key: row.team_key})
        MERGE (p)-[r:PROFESSIONAL_ON]->(t)
        SET r.salary = row.salary
    """,
    "represents_team": """
        UNWIND $rows AS row
        MATCH (p:PostgresMirror:PGPlayer {pg_key: row.player_key})
        MATCH (t:PostgresMirror:PGTeam {pg_key: row.team_key})
        MERGE (p)-[:REPRESENTS_TEAM]->(t)
    """,
    "represents_match": """
        UNWIND $rows AS row
        MATCH (p:PostgresMirror:PGPlayer {pg_key: row.player_key})
        MATCH (m:PostgresMirror:PGMatch {pg_key: row.match_key})
        MERGE (p)-[:PARTICIPATED_IN]->(m)
    """,
    "represents_platform": """
        UNWIND $rows AS row
        MATCH (p:PostgresMirror:PGPlayer {pg_key: row.player_key})
        MATCH (pl:PostgresMirror:PGPlatform {pg_key: row.platform_key})
        MERGE (p)-[:USES_PLATFORM]->(pl)
    """,
    "achievement_player": """
        UNWIND $rows AS row
        MATCH (p:PostgresMirror:PGPlayer {pg_key: row.player_key})
        MATCH (a:PostgresMirror:PGAchievement {pg_key: row.achievement_key})
        MERGE (p)-[:EARNED]->(a)
    """,
    "achievement_reward": """
        UNWIND $rows AS row
        MATCH (a:PostgresMirror:PGAchievement {pg_key: row.achievement_key})
        MATCH (r:PostgresMirror:PGReward {pg_key: row.reward_key})
        MERGE (a)-[:GRANTS]->(r)
    """,
    "match_stats": """
        UNWIND $rows AS row
        MATCH (p:PostgresMirror:PGPlayer {pg_key: row.player_key})
        MATCH (m:PostgresMirror:PGMatch {pg_key: row.match_key})
        MERGE (p)-[r:HAS_MATCH_STATS]->(m)
        SET r += row.properties
    """,
    "stats_leaderboard": """
        UNWIND $rows AS row
        MATCH (p:PostgresMirror:PGPlayer {pg_key: row.player_key})
        MATCH (l:PostgresMirror:PGLeaderboard {pg_key: row.leaderboard_key})
        MERGE (p)-[r:RANKED_ON {match_id: row.match_id}]->(l)
        SET r.score = row.score,
            r.wins = row.wins,
            r.kills = row.kills,
            r.deaths = row.deaths,
            r.assists = row.assists,
            r.kd_ratio = row.kd_ratio
    """,
    "featured_player": """
        UNWIND $rows AS row
        MATCH (g:PostgresMirror:PGGame {pg_key: row.game_key})
        MATCH (p:PostgresMirror:PGPlayer {pg_key: row.player_key})
        MERGE (g)-[:FEATURED_PLAYER]->(p)
    """,
    "player_email": """
        UNWIND $rows AS row
        MATCH (p:PostgresMirror:PGPlayer {pg_key: row.player_key})
        MATCH (e:PostgresMirror:PGEmail {pg_key: row.email_key})
        MERGE (p)-[:HAS_EMAIL]->(e)
    """,
}


def _neo4j_value(value):
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    return value


def _key(label, row, columns):
    return f"{label}:" + ":".join(str(row[column]) for column in columns)


def _fetch_snapshot():
    snapshot = {}
    with get_connection() as conn:
        with conn.cursor() as cur:
            for table, query in TABLE_QUERIES.items():
                cur.execute(query)
                snapshot[table] = [
                    {
                        column: _neo4j_value(value)
                        for column, value in row.items()
                    }
                    for row in cur.fetchall()
                ]
    return snapshot


def _player_key(player_id):
    return f"PGPlayer:{player_id}"


def sync_postgres_to_neo4j():
    snapshot = _fetch_snapshot()
    node_rows = {}

    for label, (table, key_columns) in NODE_TABLES.items():
        node_rows[label] = [
            {
                "pg_key": _key(label, row, key_columns),
                "properties": {
                    column: value
                    for column, value in row.items()
                    if not (label == "PGAccount" and column == "password_hash")
                },
            }
            for row in snapshot[table]
        ]

    player_rows = {row["player_id"]: row for row in snapshot["player"]}
    for table, property_name in (
        ("casual_player", "professional_score"),
        ("competitive_player", "player_rank"),
        ("professional_player", "salary"),
    ):
        for row in snapshot[table]:
            if row["player_id"] in player_rows:
                player_rows[row["player_id"]][property_name] = row[property_name]

    for row in node_rows["PGPlayer"]:
        row["properties"] = player_rows[row["properties"]["player_id"]]

    node_rows["PGEmail"] = [
        {
            "pg_key": f"PGEmail:{row['player_id']}:{row['email']}",
            "properties": {"email": row["email"]},
        }
        for row in snapshot["account_email"]
    ]

    relationships = {
        "account_player": [
            {
                "player_key": _player_key(row["player_id"]),
                "account_key": f"PGAccount:{row['acc_id']}",
            }
            for row in snapshot["player"]
            if row["acc_id"] is not None
        ],
        "team_country": [
            {
                "team_key": f"PGTeam:{row['team_id']}",
                "country_key": f"PGCountry:{row['country_code']}",
            }
            for row in snapshot["team"]
        ],
        "reward_type": [
            {
                "reward_key": f"PGReward:{row['reward_id']}",
                "type_key": f"PGRewardType:{row['rtype']}",
            }
            for row in snapshot["reward"]
        ],
        "reward_account": [
            {
                "reward_key": f"PGReward:{row['reward_id']}",
                "account_key": f"PGAccount:{row['acc_id']}",
            }
            for row in snapshot["reward"]
            if row["acc_id"] is not None
        ],
        "professional_team": [
            {
                "player_key": _player_key(row["player_id"]),
                "team_key": f"PGTeam:{row['team_id']}",
                "salary": row["salary"],
            }
            for row in snapshot["professional_player"]
        ],
        "represents_team": [
            {
                "player_key": _player_key(row["player_id"]),
                "team_key": f"PGTeam:{row['team_id']}",
            }
            for row in snapshot["represents_team"]
        ],
        "represents_match": [
            {
                "player_key": _player_key(row["player_id"]),
                "match_key": f"PGMatch:{row['match_id']}",
            }
            for row in snapshot["represents_match"]
        ],
        "represents_platform": [
            {
                "player_key": _player_key(row["player_id"]),
                "platform_key": f"PGPlatform:{row['plat_id']}",
            }
            for row in snapshot["represents_platform"]
        ],
        "achievement_player": [
            {
                "player_key": _player_key(row["player_id"]),
                "achievement_key": f"PGAchievement:{row['ach_id']}",
            }
            for row in snapshot["player_achievement"]
        ],
        "achievement_reward": [
            {
                "achievement_key": f"PGAchievement:{row['ach_id']}",
                "reward_key": f"PGReward:{row['reward_id']}",
            }
            for row in snapshot["player_achievement"]
            if row["reward_id"] is not None
        ],
        "match_stats": [
            {
                "player_key": _player_key(row["player_id"]),
                "match_key": f"PGMatch:{row['match_id']}",
                "properties": row,
            }
            for row in snapshot["match_player_stats"]
        ],
        "stats_leaderboard": [
            {
                "player_key": _player_key(row["player_id"]),
                "leaderboard_key": f"PGLeaderboard:{row['lb_id']}",
                **row,
            }
            for row in snapshot["match_player_stats"]
            if row["lb_id"] is not None
        ],
        "featured_player": [
            {
                "game_key": f"PGGame:{row['game_id']}",
                "player_key": _player_key(row["featured_player_id"]),
            }
            for row in snapshot["game"]
            if row["featured_player_id"] is not None
        ],
        "player_email": [
            {
                "player_key": _player_key(row["player_id"]),
                "email_key": f"PGEmail:{row['player_id']}:{row['email']}",
            }
            for row in snapshot["account_email"]
        ],
    }

    def write_snapshot(tx):
        tx.run("MATCH (n:PostgresMirror) DETACH DELETE n").consume()

        for label, rows in node_rows.items():
            if rows:
                tx.run(
                    f"""
                    UNWIND $rows AS row
                    MERGE (n:PostgresMirror:{label} {{pg_key: row.pg_key}})
                    SET n += row.properties
                    """,
                    rows=rows,
                ).consume()

        for name, query in RELATIONSHIP_QUERIES.items():
            rows = relationships[name]
            if rows:
                tx.run(query, rows=rows).consume()

        return {
            "nodes": sum(len(rows) for rows in node_rows.values()),
            "relationships": sum(len(rows) for rows in relationships.values()),
        }

    with get_driver().session() as session:
        return session.execute_write(write_snapshot)
