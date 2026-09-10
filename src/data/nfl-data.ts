import { SeasonData } from '../engine/playoff-engine';

// NFL 2026 Season Data - Week 1 (season just started)
// All games are pending (not played yet)

export const NFL_DIVISIONS = {
  AFC: {
    East: ['BUF', 'MIA', 'NE', 'NYJ'],
    North: ['BAL', 'CIN', 'CLE', 'PIT'],
    South: ['HOU', 'IND', 'JAX', 'TEN'],
    West: ['DEN', 'KC', 'LV', 'LAC'],
  },
  NFC: {
    East: ['DAL', 'NYG', 'PHI', 'WAS'],
    North: ['CHI', 'DET', 'GB', 'MIN'],
    South: ['ATL', 'CAR', 'NO', 'TB'],
    West: ['ARI', 'LAR', 'SF', 'SEA'],
  },
};

export const TEAM_NAMES: Record<string, string> = {
  BUF: 'Bills', MIA: 'Dolphins', NE: 'Patriots', NYJ: 'Jets',
  BAL: 'Ravens', CIN: 'Bengals', CLE: 'Browns', PIT: 'Steelers',
  HOU: 'Texans', IND: 'Colts', JAX: 'Jaguars', TEN: 'Titans',
  DEN: 'Broncos', KC: 'Chiefs', LV: 'Raiders', LAC: 'Chargers',
  DAL: 'Cowboys', NYG: 'Giants', PHI: 'Eagles', WAS: 'Commanders',
  CHI: 'Bears', DET: 'Lions', GB: 'Packers', MIN: 'Vikings',
  ATL: 'Falcons', CAR: 'Panthers', NO: 'Saints', TB: 'Buccaneers',
  ARI: 'Cardinals', LAR: 'Rams', SF: '49ers', SEA: 'Seahawks',
};

export const TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
  BUF: { primary: '#00338D', secondary: '#C60C30' },
  MIA: { primary: '#008E97', secondary: '#FC4C02' },
  NE: { primary: '#002244', secondary: '#C60C30' },
  NYJ: { primary: '#125740', secondary: '#000000' },
  BAL: { primary: '#241773', secondary: '#9E7C0C' },
  CIN: { primary: '#FB4F14', secondary: '#000000' },
  CLE: { primary: '#311D00', secondary: '#FF3C00' },
  PIT: { primary: '#FFB612', secondary: '#101820' },
  HOU: { primary: '#03202F', secondary: '#A71930' },
  IND: { primary: '#002C5F', secondary: '#A2AAAD' },
  JAX: { primary: '#006778', secondary: '#D7A22A' },
  TEN: { primary: '#0C2340', secondary: '#4B92DB' },
  DEN: { primary: '#FB4F14', secondary: '#002244' },
  KC: { primary: '#E31837', secondary: '#FFB81C' },
  LV: { primary: '#000000', secondary: '#A5ACAF' },
  LAC: { primary: '#0080C6', secondary: '#FFC20E' },
  DAL: { primary: '#003594', secondary: '#869397' },
  NYG: { primary: '#0B2265', secondary: '#A71930' },
  PHI: { primary: '#004C54', secondary: '#A5ACAF' },
  WAS: { primary: '#5A1414', secondary: '#FFB612' },
  CHI: { primary: '#0B162A', secondary: '#C83803' },
  DET: { primary: '#0076B6', secondary: '#B0B7BC' },
  GB: { primary: '#203731', secondary: '#FFB612' },
  MIN: { primary: '#4F2683', secondary: '#FFC62F' },
  ATL: { primary: '#A71930', secondary: '#000000' },
  CAR: { primary: '#0085CA', secondary: '#101820' },
  NO: { primary: '#D3BC8D', secondary: '#101820' },
  TB: { primary: '#D50A0A', secondary: '#34302B' },
  ARI: { primary: '#97233F', secondary: '#000000' },
  LAR: { primary: '#003594', secondary: '#FFA300' },
  SF: { primary: '#AA0000', secondary: '#B3995D' },
  SEA: { primary: '#002244', secondary: '#69BE28' },
};

// Team power ratings for 2026 season (ELO-like, higher = better)
export const TEAM_RATINGS: Record<string, number> = {
  KC: 8.5, BUF: 7.8, DET: 7.5, BAL: 7.2, PHI: 7.0,
  MIN: 6.5, WAS: 6.2, HOU: 5.8, PIT: 5.5, GB: 5.3,
  DEN: 5.0, LAC: 4.8, TB: 4.5, ARI: 4.2, CIN: 4.0,
  DAL: 3.8, SEA: 3.5, MIA: 3.2, IND: 3.0, ATL: 2.8,
  CHI: 2.5, LAR: 2.2, SF: 2.0, NO: 1.8, NYJ: 1.5,
  JAX: 1.2, TEN: 1.0, LV: 0.8, NYG: 0.5, CAR: 0.2,
  CLE: 0.0, NE: -0.5,
};

// Generate 2026 NFL schedule - Week 1 matchups
// All games are pending (done: false)
function generateSchedule(): Record<string, any[]> {
  const games: Record<string, any[]> = {};
  let gameId = 1;

  // Week 1 matchups for 2026 season
  const week1Matchups: [string, string][] = [
    ['NE', 'SEA'],
    ['SF', 'LAR'],
    ['CHI', 'CAR'],
    ['TB', 'CIN'],
    ['NO', 'DET'],
    ['BUF', 'HOU'],
    ['BAL', 'IND'],
    ['CLE', 'JAX'],
    ['ATL', 'PIT'],
    ['NYJ', 'TEN'],
    ['ARI', 'LAC'],
    ['MIA', 'LV'],
    ['GB', 'MIN'],
    ['WAS', 'PHI'],
    ['DAL', 'NYG'],
    ['DEN', 'KC'],
  ];

  games['1'] = week1Matchups.map((matchup, idx) => {
    const [away, home] = matchup;
    const homeRating = TEAM_RATINGS[home] || 0;
    const awayRating = TEAM_RATINGS[away] || 0;
    // Calculate win probability with home field advantage
    const margin = homeRating - awayRating + 1.7;
    const wp = 1 / (1 + Math.exp(-0.107 * margin));
    
    return {
      id: gameId++,
      week: 1,
      away,
      home,
      pIndex: idx,
      wp: Math.max(0.15, Math.min(0.85, wp)), // Clamp between 15% and 85%
      done: false,
      hs: 0,
      as: 0,
    };
  });

  // Generate remaining weeks (2-18) with placeholder matchups
  // In a real app, this would be the actual 2026 schedule
  for (let week = 2; week <= 18; week++) {
    games[String(week)] = [];
    // For now, create some placeholder games
    // A real implementation would have the full 2026 schedule
    const teams = Object.keys(TEAM_RATINGS);
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < 16; i += 2) {
      if (i + 1 < shuffled.length) {
        const away = shuffled[i];
        const home = shuffled[i + 1];
        const homeRating = TEAM_RATINGS[home] || 0;
        const awayRating = TEAM_RATINGS[away] || 0;
        const margin = homeRating - awayRating + 1.7;
        const wp = 1 / (1 + Math.exp(-0.107 * margin));
        
        games[String(week)].push({
          id: gameId++,
          week,
          away,
          home,
          pIndex: i / 2,
          wp: Math.max(0.15, Math.min(0.85, wp)),
          done: false,
          hs: 0,
          as: 0,
        });
      }
    }
  }

  return games;
}

export function createSeasonData(): SeasonData {
  const data: SeasonData = {
    divisions: NFL_DIVISIONS,
    games: generateSchedule(),
    ratings: TEAM_RATINGS,
    simCount: 1000,
  };
  return data;
}
