
CREATE CONSTRAINT player_id_unique IF NOT EXISTS
FOR (p:Player)
REQUIRE p.player_id IS UNIQUE;

CREATE CONSTRAINT team_id_unique IF NOT EXISTS
FOR (t:Team)
REQUIRE t.team_id IS UNIQUE;

CREATE CONSTRAINT match_id_unique IF NOT EXISTS
FOR (m:Match)
REQUIRE m.match_id IS UNIQUE;

CREATE CONSTRAINT leaderboard_id_unique IF NOT EXISTS
FOR (l:Leaderboard)
REQUIRE l.lb_id IS UNIQUE;

CREATE CONSTRAINT achievement_id_unique IF NOT EXISTS
FOR (a:Achievement)
REQUIRE a.ach_id IS UNIQUE;
