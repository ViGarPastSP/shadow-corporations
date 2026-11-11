-- Shadow Corporations - Initial Schema

-- Players
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  specialization TEXT NOT NULL CHECK (specialization IN ('executive', 'spy', 'lobbyist', 'financier', 'propagandist')),
  level INTEGER DEFAULT 1,
  capital BIGINT DEFAULT 10000,
  influence INTEGER DEFAULT 50,
  information INTEGER DEFAULT 10,
  risk INTEGER DEFAULT 0,
  corporation_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Corporations
CREATE TABLE IF NOT EXISTS corporations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tag TEXT UNIQUE NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES players(id),
  treasury BIGINT DEFAULT 0,
  city_control NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE players
  ADD CONSTRAINT fk_corporation
  FOREIGN KEY (corporation_id) REFERENCES corporations(id) ON DELETE SET NULL;

-- Districts (one city for MVP)
CREATE TABLE IF NOT EXISTS districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city_name TEXT DEFAULT 'Neo-Veridia',
  stability INTEGER DEFAULT 70,
  economy INTEGER DEFAULT 50,
  corruption INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- District control by corporation
CREATE TABLE IF NOT EXISTS district_control (
  district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
  corporation_id UUID REFERENCES corporations(id) ON DELETE CASCADE,
  percentage NUMERIC(5,2) DEFAULT 0,
  PRIMARY KEY (district_id, corporation_id)
);

-- Operations
CREATE TABLE IF NOT EXISTS operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('espionage', 'sabotage', 'lobby', 'propaganda', 'blackmail')),
  target TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'preparing' CHECK (status IN ('preparing', 'active', 'completed', 'failed')),
  risk_level INTEGER DEFAULT 10,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completes_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
CREATE INDEX IF NOT EXISTS idx_players_corporation ON players(corporation_id);
CREATE INDEX IF NOT EXISTS idx_operations_player ON operations(player_id);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporations ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE district_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;

-- Basic policies (players can read their own data)
CREATE POLICY "Players can view own profile" ON players
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Players can update own profile" ON players
  FOR UPDATE USING (auth.uid() = user_id);

-- Public read for rankings later
CREATE POLICY "Anyone can view corporations" ON corporations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view districts" ON districts
  FOR SELECT USING (true);