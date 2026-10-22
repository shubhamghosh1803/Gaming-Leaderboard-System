
import os
from pathlib import Path

from dotenv import load_dotenv
from neo4j import GraphDatabase

# Load the .env file located beside this Python file.
load_dotenv(Path(__file__).with_name(".env"))

URI = os.getenv("NEO4J_URI")
USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD")
DATABASE = os.getenv("NEO4J_DATABASE", "neo4j")

_driver = None


def get_driver():
    """Create the Neo4j driver when first needed."""
    global _driver

    if not URI or not PASSWORD:
        raise RuntimeError(
            "NEO4J_URI or NEO4J_PASSWORD is missing from backend/.env"
        )

    if _driver is None:
        _driver = GraphDatabase.driver(
            URI,
            auth=(USERNAME, PASSWORD)
        )

    return _driver


def verify_connection():
    """Verify connectivity and execute a small test query."""
    driver = get_driver()
    driver.verify_connectivity()

    with driver.session(database=DATABASE) as session:
        result = session.run(
            "RETURN 'Neo4j connected successfully!' AS message"
        )
        return result.single()["message"]


def close_connection():
    """Close the driver when the application shuts down."""
    global _driver

    if _driver is not None:
        _driver.close()
        _driver = None


def upsert_player(player: dict):
    query = """
    MERGE (p:PostgresMirror:PGPlayer {pg_key: $pg_key})
    SET p.code = $code,
        p.dob = $dob,
        p.first_name = $first_name,
        p.middle_name = $middle_name,
        p.last_name = $last_name,
        p.skill_level = $skill_level,
        p.acc_id = $acc_id,
        p.player_id = $player_id
    """
    dob = player["dob"]
    if dob is not None:
        dob = dob.isoformat()

    with get_driver().session(database=DATABASE) as session:
        session.run(
            query,
            pg_key=f"Player:{player['player_id']}",
            player_id=player["player_id"],
            code=player["code"],
            dob=dob,
            first_name=player["first_name"],
            middle_name=player["middle_name"],
            last_name=player["last_name"],
            skill_level=player["skill_level"],
            acc_id=player["acc_id"],
        )


def delete_player(player_id: int):
    query = """
    MATCH (p:PostgresMirror:PGPlayer {pg_key: $pg_key})
    DETACH DELETE p
    """

    with get_driver().session(database=DATABASE) as session:
        session.run(query, pg_key=f"Player:{player_id}")


def get_player_graph(player_id: int):
    query = """
    MATCH (p:PostgresMirror:PGPlayer {player_id: $player_id})
    OPTIONAL MATCH (p)-[r]-(connected)
    RETURN
        p {
            .player_id,
            .code,
            .first_name,
            .last_name,
            .skill_level
        } AS player,
        collect(
            CASE WHEN connected IS NOT NULL THEN {
                relationship: type(r),
                direction: CASE
                    WHEN startNode(r) = p THEN 'OUTGOING'
                    ELSE 'INCOMING'
                END,
                entity_type: labels(connected),
                entity: properties(connected)
            } END
        ) AS connections
    """

    with get_driver().session(database=DATABASE) as session:
        record = session.run(
            query, player_id=player_id
        ).single()

        if record is None:
            return None

        return {
            "player": record["player"],
            "connections": record["connections"]
        }


def get_graph_summary():
    query = """
    MATCH (n:PostgresMirror)
    WITH count(n) AS nodes
    OPTIONAL MATCH (:PostgresMirror)-[r]->(:PostgresMirror)
    RETURN nodes, count(r) AS relationships
    """

    with get_driver().session(database=DATABASE) as session:
        record = session.run(query).single()
        return dict(record)
