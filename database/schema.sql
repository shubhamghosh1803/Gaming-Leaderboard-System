CREATE TABLE account (
    acc_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    doc TEXT,
    password_hash TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active'
        CHECK (status IN ('Active', 'Inactive', 'Blocked'))
);

CREATE TABLE country_info (
    country_code VARCHAR(10) PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE game (
    game_id SERIAL PRIMARY KEY,
    developer VARCHAR(150) NOT NULL,
    release_date DATE,
    max_players INT CHECK (max_players > 0),
    genre VARCHAR(100) NOT NULL,
    name VARCHAR(150),
);

CREATE TABLE platform (
    plat_id SERIAL PRIMARY KEY,
    platform_name VARCHAR(100) NOT NULL UNIQUE,
    released DATE,
    manufacturer VARCHAR(150)
);

CREATE TABLE reward_type (
    rtype VARCHAR(50) PRIMARY KEY,
    expirydate DATE
);


CREATE TABLE team (
    team_id SERIAL PRIMARY KEY,
    tag VARCHAR(20) NOT NULL UNIQUE,
    team_name VARCHAR(150) NOT NULL,
    state VARCHAR(100),
    city VARCHAR(100),
    street VARCHAR(200),
    country_code VARCHAR(10) NOT NULL,

    CONSTRAINT fk_team_country
        FOREIGN KEY (country_code)
        REFERENCES country_info(country_code)
);

CREATE TABLE player (
    player_id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    dob DATE,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    skill_level VARCHAR(50),
    acc_id INT,

    CONSTRAINT fk_player_account
        FOREIGN KEY (acc_id)
        REFERENCES account(acc_id)
);

CREATE TABLE reward (
    reward_id SERIAL PRIMARY KEY,
    rtype VARCHAR(50) NOT NULL,
    acc_id INT,
    CONSTRAINT fk_reward_type
        FOREIGN KEY (rtype)
        REFERENCES reward_type(rtype),
    CONSTRAINT fk_reward_account
        FOREIGN KEY (acc_id)
        REFERENCES account(acc_id)
);

CREATE TABLE casual_player (
    player_id INT PRIMARY KEY,
    professional_score NUMERIC(10, 2) DEFAULT 0
        CHECK (professional_score >= 0),

    CONSTRAINT fk_casual_player
        FOREIGN KEY (player_id)
        REFERENCES player(player_id)
        ON DELETE CASCADE
);

CREATE TABLE competitive_player (
    player_id INT PRIMARY KEY,
    player_rank INT CHECK (player_rank > 0),

    CONSTRAINT fk_competitive_player
        FOREIGN KEY (player_id)
        REFERENCES player(player_id)
        ON DELETE CASCADE
);

CREATE TABLE professional_player (
    player_id INT PRIMARY KEY,
    team_id INT NOT NULL,
    salary NUMERIC(12, 2) CHECK (salary >= 0),

    CONSTRAINT fk_professional_player
        FOREIGN KEY (player_id)
        REFERENCES player(player_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_professional_team
        FOREIGN KEY (team_id)
        REFERENCES team(team_id)
);

CREATE TABLE match (
    match_id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'Scheduled'
        CHECK (
            status IN (
                'Scheduled',
                'Ongoing',
                'Completed',
                'Cancelled'
            )
        ),
    score VARCHAR(50),
    duration INT CHECK (duration >= 0),
    result VARCHAR(100),
    total_matches INT DEFAULT 0
        CHECK (total_matches >= 0)
);


CREATE TABLE leaderboard (
    lb_id SERIAL PRIMARY KEY,
    ltype VARCHAR(50) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ranking INT CHECK (ranking > 0),
    total_participant INT DEFAULT 0
        CHECK (total_participant >= 0)
);


CREATE TABLE represents_team (
    player_id INT NOT NULL,
    team_id INT NOT NULL,

    PRIMARY KEY (player_id, team_id),

    CONSTRAINT fk_represents_team_player
        FOREIGN KEY (player_id)
        REFERENCES player(player_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_represents_team_team
        FOREIGN KEY (team_id)
        REFERENCES team(team_id)
        ON DELETE CASCADE
);


CREATE TABLE represents_match (
    player_id INT NOT NULL,
    match_id INT NOT NULL,

    PRIMARY KEY (player_id, match_id),

    CONSTRAINT fk_represents_match_player
        FOREIGN KEY (player_id)
        REFERENCES player(player_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_represents_match_match
        FOREIGN KEY (match_id)
        REFERENCES match(match_id)
        ON DELETE CASCADE
);


CREATE TABLE represents_platform (
    player_id INT NOT NULL,
    plat_id INT NOT NULL,

    PRIMARY KEY (player_id, plat_id),

    CONSTRAINT fk_represents_platform_player
        FOREIGN KEY (player_id)
        REFERENCES player(player_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_represents_platform_platform
        FOREIGN KEY (plat_id)
        REFERENCES platform(plat_id)
        ON DELETE CASCADE
);

CREATE TABLE player_achievement (
    ach_id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    points INT DEFAULT 0 CHECK (points >= 0),
    player_id INT NOT NULL,
    reward_id INT,

    CONSTRAINT fk_achievement_player
        FOREIGN KEY (player_id)
        REFERENCES player(player_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_achievement_reward
        FOREIGN KEY (reward_id)
        REFERENCES reward(reward_id)
);


CREATE TABLE match_player_stats (
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    lb_id INT,
    wins INT DEFAULT 0 CHECK (wins >= 0),
    score INT DEFAULT 0 CHECK (score >= 0),
    deaths INT DEFAULT 0 CHECK (deaths >= 0),
    headshots INT DEFAULT 0 CHECK (headshots >= 0),
    kills INT DEFAULT 0 CHECK (kills >= 0),
    assists INT DEFAULT 0 CHECK (assists >= 0),
    kd_ratio NUMERIC(6, 2) DEFAULT 0
        CHECK (kd_ratio >= 0),

    PRIMARY KEY (match_id, player_id),

    CONSTRAINT fk_stats_match
        FOREIGN KEY (match_id)
        REFERENCES match(match_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_stats_player
        FOREIGN KEY (player_id)
        REFERENCES player(player_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_stats_leaderboard
        FOREIGN KEY (lb_id)
        REFERENCES leaderboard(lb_id)
);


CREATE TABLE account_email (
    player_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,

    PRIMARY KEY (player_id, email),

    CONSTRAINT fk_player_email
        FOREIGN KEY (player_id)
        REFERENCES player(player_id)
        ON DELETE CASCADE
);