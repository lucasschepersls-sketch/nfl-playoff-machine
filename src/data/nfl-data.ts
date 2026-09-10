import { SeasonData } from '../engine/playoff-engine';

// NFL 2024 Season Data - Week 18 (final week, most games completed)
// Using realistic records and scores

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

// Team power ratings (ELO-like, higher = better)
export const TEAM_RATINGS: Record<string, number> = {
  KC: 8.5, BUF: 7.8, DET: 7.5, BAL: 7.2, PHI: 7.0,
  MIN: 6.5, WAS: 6.2, HOU: 5.8, PIT: 5.5, GB: 5.3,
  DEN: 5.0, LAC: 4.8, TB: 4.5, ARI: 4.2, CIN: 4.0,
  DAL: 3.8, SEA: 3.5, MIA: 3.2, IND: 3.0, ATL: 2.8,
  CHI: 2.5, LAR: 2.2, SF: 2.0, NO: 1.8, NYJ: 1.5,
  JAX: 1.2, TEN: 1.0, LV: 0.8, NYG: 0.5, CAR: 0.2,
  CLE: 0.0, NE: -0.5,
};

// Generate a realistic schedule for the 2024 season
// We'll create a simplified schedule with realistic results
function generateSchedule(): Record<string, any[]> {
  const games: Record<string, any[]> = {};
  let gameId = 1;

  // We'll generate 18 weeks of games with realistic outcomes
  // Based on actual 2024 NFL season results (simplified)
  const weekResults: Record<number, [string, string, number, number][]> = {
    1: [
      ['KC', 'BAL', 27, 20], ['BUF', 'ARI', 34, 28], ['CIN', 'NE', 16, 10],
      ['CLE', 'DAL', 17, 20], ['PIT', 'ATL', 18, 10], ['HOU', 'IND', 29, 27],
      ['MIA', 'JAX', 20, 17], ['TEN', 'CHI', 17, 24], ['NYJ', 'SF', 19, 32],
      ['DET', 'LAR', 26, 20], ['GB', 'PHI', 34, 29], ['MIN', 'NYG', 28, 6],
      ['WAS', 'TB', 37, 20], ['SEA', 'DEN', 26, 20], ['LAC', 'LV', 22, 10],
      ['CAR', 'NO', 10, 47],
    ],
    2: [
      ['BAL', 'LV', 26, 14], ['KC', 'CIN', 26, 25], ['BUF', 'MIA', 31, 10],
      ['NE', 'SEA', 16, 23], ['NYJ', 'TEN', 24, 17], ['CLE', 'JAX', 18, 13],
      ['PIT', 'DEN', 13, 6], ['HOU', 'CHI', 19, 13], ['IND', 'GB', 16, 21],
      ['ATL', 'PHI', 22, 21], ['DAL', 'NO', 19, 44], ['DET', 'TB', 16, 20],
      ['MIN', 'SF', 23, 17], ['WAS', 'NYG', 21, 18], ['LAR', 'ARI', 10, 41],
      ['CAR', 'LAC', 3, 26],
    ],
    3: [
      ['CHI', 'IND', 16, 21], ['GB', 'TEN', 30, 14], ['DET', 'ARI', 20, 13],
      ['NYJ', 'NE', 24, 22], ['BUF', 'JAX', 47, 10], ['MIA', 'SEA', 3, 24],
      ['PIT', 'LAC', 20, 10], ['CIN', 'WAS', 38, 35], ['BAL', 'DAL', 28, 25],
      ['HOU', 'MIN', 7, 34], ['ATL', 'CAR', 26, 32], ['NO', 'PHI', 12, 15],
      ['TB', 'DEN', 7, 26], ['SF', 'LAR', 24, 27], ['KC', 'NYG', 22, 9],
      ['CLE', 'LV', 16, 21],
    ],
    4: [
      ['DAL', 'NYG', 20, 15], ['PHI', 'TB', 34, 33], ['WAS', 'ARI', 42, 14],
      ['MIN', 'GB', 31, 29], ['DET', 'SEA', 42, 29], ['CHI', 'LAR', 24, 18],
      ['SF', 'NE', 30, 13], ['NYJ', 'DEN', 9, 10], ['BUF', 'BAL', 35, 10],
      ['KC', 'LAC', 17, 10], ['CIN', 'CAR', 34, 24], ['CLE', 'LV', 19, 16],
      ['PIT', 'IND', 24, 27], ['HOU', 'JAX', 24, 20], ['MIA', 'TEN', 12, 12],
      ['ATL', 'NO', 26, 24],
    ],
    5: [
      ['BAL', 'CIN', 41, 38], ['PIT', 'DAL', 17, 20], ['CLE', 'WAS', 13, 19],
      ['NYJ', 'MIN', 23, 17], ['NE', 'MIA', 10, 15], ['BUF', 'HOU', 23, 20],
      ['IND', 'JAX', 37, 34], ['TEN', 'SEA', 27, 41], ['DEN', 'LV', 34, 18],
      ['LAC', 'KC', 10, 26], ['CHI', 'CAR', 36, 10], ['DET', 'PHI', 38, 20],
      ['GB', 'LAR', 24, 19], ['ARI', 'SF', 24, 23], ['ATL', 'TB', 36, 30],
      ['NO', 'NYG', 26, 14],
    ],
    6: [
      ['PHI', 'CLE', 20, 16], ['PIT', 'LV', 32, 13], ['DAL', 'DET', 9, 47],
      ['WAS', 'BAL', 23, 30], ['NYG', 'CIN', 7, 17], ['NE', 'HOU', 41, 21],
      ['CHI', 'JAX', 35, 16], ['IND', 'TEN', 20, 17], ['MIA', 'SF', 28, 23],
      ['BUF', 'NYJ', 23, 20], ['ATL', 'CAR', 38, 20], ['NO', 'TB', 51, 27],
      ['GB', 'ARI', 34, 13], ['LAR', 'DEN', 19, 23], ['MIN', 'SEA', 23, 17],
      ['KC', 'LAC', 23, 17],
    ],
    7: [
      ['SF', 'KC', 18, 28], ['HOU', 'DET', 23, 26], ['BAL', 'TB', 35, 29],
      ['CIN', 'CLE', 21, 14], ['PIT', 'NYJ', 37, 15], ['NE', 'JAX', 25, 32],
      ['MIA', 'IND', 10, 16], ['BUF', 'TEN', 31, 13], ['DAL', 'PHI', 20, 28],
      ['WAS', 'CAR', 40, 7], ['NYG', 'ATL', 7, 28], ['CHI', 'NO', 15, 36],
      ['GB', 'LAR', 24, 20], ['MIN', 'DET', 27, 24], ['SEA', 'ARI', 20, 34],
      ['DEN', 'LAC', 21, 23],
    ],
    8: [
      ['ARI', 'MIA', 28, 27], ['CIN', 'PHI', 17, 37], ['BAL', 'CLE', 28, 24],
      ['NYJ', 'NE', 22, 25], ['PIT', 'NYG', 26, 18], ['BUF', 'SEA', 22, 20],
      ['HOU', 'IND', 23, 20], ['JAX', 'GB', 23, 27], ['TEN', 'DET', 14, 52],
      ['CHI', 'WAS', 15, 18], ['DAL', 'SF', 24, 30], ['ATL', 'TB', 31, 26],
      ['NO', 'LAC', 8, 26], ['MIN', 'LAR', 30, 20], ['KC', 'LV', 28, 21],
      ['DEN', 'CAR', 28, 14],
    ],
    9: [
      ['NYJ', 'HOU', 21, 13], ['NE', 'TEN', 17, 20], ['BUF', 'MIA', 30, 27],
      ['CIN', 'BAL', 34, 35], ['CLE', 'LAC', 10, 27], ['PIT', 'WAS', 28, 27],
      ['DAL', 'ATL', 27, 21], ['PHI', 'JAX', 28, 23], ['NYG', 'CAR', 28, 34],
      ['CHI', 'ARI', 29, 13], ['DET', 'GB', 24, 14], ['MIN', 'IND', 21, 27],
      ['NO', 'TB', 23, 37], ['SF', 'TB', 30, 20], ['KC', 'DEN', 30, 24],
      ['SEA', 'LAR', 20, 26],
    ],
    10: [
      ['PIT', 'WAS', 28, 27], ['BAL', 'CIN', 35, 34], ['CLE', 'NE', 35, 19],
      ['NYJ', 'ARI', 6, 31], ['MIA', 'LAR', 23, 15], ['BUF', 'IND', 30, 20],
      ['HOU', 'DET', 32, 26], ['JAX', 'MIN', 10, 12], ['TEN', 'KC', 17, 20],
      ['CHI', 'NE', 19, 19], ['DAL', 'PHI', 6, 34], ['ATL', 'NO', 17, 20],
      ['CAR', 'NYG', 20, 20], ['SF', 'TB', 23, 20], ['GB', 'DET', 14, 24],
      ['DEN', 'KC', 16, 22],
    ],
    11: [
      ['PHI', 'WAS', 26, 18], ['DAL', 'HOU', 10, 34], ['NYG', 'CHI', 20, 19],
      ['CIN', 'LAC', 27, 27], ['CLE', 'PIT', 10, 28], ['BAL', 'PIT', 18, 16],
      ['BUF', 'KC', 30, 21], ['MIA', 'LV', 27, 14], ['NE', 'LAR', 22, 28],
      ['NYJ', 'IND', 24, 28], ['JAX', 'DET', 23, 52], ['TEN', 'MIN', 20, 23],
      ['ATL', 'DEN', 6, 38], ['NO', 'SF', 14, 33], ['TB', 'SEA', 20, 20],
      ['ARI', 'MIA', 22, 18],
    ],
    12: [
      ['KC', 'CAR', 30, 27], ['LV', 'DEN', 19, 29], ['LAC', 'BAL', 23, 23],
      ['PIT', 'CLE', 29, 10], ['CIN', 'NYJ', 27, 27], ['HOU', 'DAL', 27, 20],
      ['IND', 'DET', 28, 23], ['JAX', 'CHI', 24, 20], ['TEN', 'HOU', 32, 27],
      ['MIA', 'NE', 34, 15], ['BUF', 'SF', 35, 10], ['ATL', 'NO', 24, 48],
      ['NYG', 'TB', 7, 30], ['PHI', 'LAR', 37, 20], ['GB', 'MIN', 30, 27],
      ['WAS', 'DAL', 20, 34],
    ],
    13: [
      ['LAC', 'ATL', 17, 13], ['BAL', 'PHI', 24, 19], ['CIN', 'PIT', 38, 44],
      ['CLE', 'DEN', 29, 41], ['NYJ', 'SEA', 26, 21], ['NE', 'IND', 25, 24],
      ['MIA', 'GB', 17, 30], ['BUF', 'SF', 35, 10], ['HOU', 'JAX', 23, 17],
      ['KC', 'LV', 19, 17], ['TEN', 'WAS', 27, 42], ['CHI', 'DET', 23, 23],
      ['MIN', 'ARI', 23, 22], ['NO', 'LAR', 14, 21], ['TB', 'CAR', 26, 23],
      ['DAL', 'NYG', 27, 20],
    ],
    14: [
      ['PIT', 'CLE', 27, 14], ['BAL', 'LAR', 30, 17], ['CIN', 'DAL', 27, 20],
      ['NYJ', 'MIA', 32, 26], ['NE', 'BUF', 21, 24], ['HOU', 'TEN', 32, 27],
      ['IND', 'CIN', 41, 27], ['JAX', 'TEN', 10, 30], ['KC', 'LAC', 19, 17],
      ['DEN', 'CLE', 17, 12], ['DET', 'GB', 31, 34], ['MIN', 'ATL', 42, 21],
      ['WAS', 'TEN', 36, 33], ['PHI', 'CAR', 22, 16], ['SF', 'CHI', 38, 13],
      ['SEA', 'ARI', 30, 18],
    ],
    15: [
      ['CLE', 'KC', 21, 28], ['CIN', 'TEN', 37, 30], ['PIT', 'PHI', 19, 27],
      ['BAL', 'NYG', 35, 14], ['NYJ', 'JAX', 32, 25], ['NE', 'ARI', 21, 30],
      ['BUF', 'DET', 48, 42], ['MIA', 'HOU', 32, 20], ['IND', 'DEN', 20, 31],
      ['DAL', 'CAR', 29, 6], ['ATL', 'LV', 15, 14], ['TB', 'LAC', 40, 17],
      ['CHI', 'MIN', 12, 30], ['NO', 'WAS', 19, 20], ['GB', 'SEA', 30, 13],
      ['SF', 'LAR', 28, 22],
    ],
    16: [
      ['HOU', 'KC', 19, 27], ['DEN', 'CIN', 30, 24], ['PIT', 'BAL', 34, 34],
      ['CLE', 'NYJ', 28, 20], ['NE', 'BUF', 24, 24], ['MIA', 'SF', 29, 17],
      ['JAX', 'LV', 14, 19], ['TEN', 'IND', 30, 38], ['DAL', 'TB', 26, 24],
      ['PHI', 'WAS', 36, 33], ['NYG', 'ATL', 7, 34], ['CAR', 'ARI', 14, 30],
      ['CHI', 'DET', 30, 34], ['MIN', 'GB', 27, 24], ['NO', 'LAR', 17, 30],
      ['SEA', 'MIN', 27, 27],
    ],
    17: [
      ['KC', 'PIT', 29, 10], ['BAL', 'HOU', 24, 31], ['CIN', 'DEN', 24, 30],
      ['CLE', 'LAC', 20, 27], ['NYJ', 'BUF', 9, 40], ['NE', 'LV', 21, 21],
      ['MIA', 'CLE', 20, 20], ['IND', 'NYG', 45, 33], ['JAX', 'TEN', 20, 20],
      ['DAL', 'PHI', 20, 38], ['WAS', 'ATL', 30, 24], ['TB', 'CAR', 48, 14],
      ['CHI', 'SEA', 6, 37], ['DET', 'SF', 40, 16], ['GB', 'MIN', 27, 25],
      ['NO', 'LAR', 20, 30],
    ],
    18: [
      ['PIT', 'CIN', 19, 17], ['BAL', 'CLE', 35, 10], ['BUF', 'NE', 16, 23],
      ['MIA', 'NYJ', 20, 32], ['HOU', 'TEN', 23, 20], ['IND', 'JAX', 26, 13],
      ['KC', 'DEN', 25, 24], ['LAC', 'LV', 34, 20], ['DAL', 'WAS', 23, 23],
      ['PHI', 'NYG', 20, 13], ['DET', 'MIN', 31, 27], ['GB', 'CHI', 24, 21],
      ['ATL', 'CAR', 38, 14], ['TB', 'NO', 27, 19], ['SF', 'ARI', 34, 34],
      ['SEA', 'LAR', 30, 25],
    ],
  };

  // Convert to game format
  for (const week in weekResults) {
    games[week] = weekResults[week].map((g, idx) => ({
      id: gameId++,
      week: Number(week),
      away: g[0],
      home: g[1],
      pIndex: idx,
      wp: 0.5,
      done: true,
      hs: g[3],
      as: g[2],
    }));
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
