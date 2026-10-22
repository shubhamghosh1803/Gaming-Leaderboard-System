
MERGE (p1:Player {player_id: 1})
SET p1.code = "PLY001",
    p1.first_name = "Arjun",
    p1.last_name = "Sharma",
    p1.skill_level = "Advanced"

MERGE (p2:Player {player_id: 2})
SET p2.code = "PLY002",
    p2.first_name = "Priya",
    p2.last_name = "Verma",
    p2.skill_level = "Intermediate"

MERGE (t1:Team {team_id: 1})
SET t1.tag = "TGR",
    t1.team_name = "Team Tigers"

MERGE (m1:Match {match_id: 1})
SET m1.status = "Completed",
    m1.score = 250,
    m1.duration = 35,
    m1.result = "Team Tigers won"

MERGE (l1:Leaderboard {lb_id: 1})
SET l1.ltype = "Global",
    l1.ranking = 1,
    l1.total_participant = 2

MERGE (a1:Achievement {ach_id: 1})
SET a1.category = "First Victory",
    a1.points = 100

MERGE (p1)-[:MEMBER_OF]->(t1)
MERGE (p1)-[:PARTICIPATED_IN {kills: 15, deaths: 3, wins: 1}]->(m1)
MERGE (p2)-[:PARTICIPATED_IN {kills: 8, deaths: 6, wins: 0}]->(m1)
MERGE (p1)-[:RANKED_ON {score: 250, rank: 1}]->(l1)
MERGE (p2)-[:RANKED_ON {score: 180, rank: 2}]->(l1)
MERGE (p1)-[:EARNED]->(a1);
