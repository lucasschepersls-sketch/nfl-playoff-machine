import { SeasonData } from '../engine/playoff-engine';

// NFL 2026 Season Data - Season just started
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

// Complete 2026 NFL Schedule - 18 weeks, 16 games per week (32 teams)
// Each team plays exactly once per week
function generateSchedule(): Record<string, any[]> {
  const games: Record<string, any[]> = {};
  let gameId = 1;

  // Week 1 - Opening matchups
  const week1: [string, string][] = [
    ['NE', 'SEA'], ['SF', 'LAR'], ['CHI', 'CAR'], ['TB', 'CIN'],
    ['NO', 'DET'], ['BUF', 'HOU'], ['BAL', 'IND'], ['CLE', 'JAX'],
    ['ATL', 'PIT'], ['NYJ', 'TEN'], ['ARI', 'LAC'], ['MIA', 'LV'],
    ['GB', 'MIN'], ['WAS', 'PHI'], ['DAL', 'NYG'], ['DEN', 'KC'],
  ];

  // Week 2
  const week2: [string, string][] = [
    ['LV', 'BAL'], ['CIN', 'KC'], ['MIA', 'BUF'], ['SEA', 'NE'],
    ['TEN', 'NYJ'], ['JAX', 'CLE'], ['DEN', 'PIT'], ['CHI', 'HOU'],
    ['GB', 'IND'], ['PHI', 'ATL'], ['NO', 'DAL'], ['TB', 'DET'],
    ['SF', 'MIN'], ['NYG', 'WAS'], ['ARI', 'LAR'], ['LAC', 'CAR'],
  ];

  // Week 3
  const week3: [string, string][] = [
    ['IND', 'CHI'], ['TEN', 'GB'], ['ARI', 'DET'], ['NE', 'NYJ'],
    ['JAX', 'BUF'], ['SEA', 'MIA'], ['LAC', 'PIT'], ['WAS', 'CIN'],
    ['DAL', 'BAL'], ['MIN', 'HOU'], ['CAR', 'ATL'], ['PHI', 'NO'],
    ['DEN', 'TB'], ['LAR', 'SF'], ['NYG', 'KC'], ['LV', 'CLE'],
  ];

  // Week 4
  const week4: [string, string][] = [
    ['NYG', 'DAL'], ['TB', 'PHI'], ['ARI', 'WAS'], ['GB', 'MIN'],
    ['SEA', 'DET'], ['LAR', 'CHI'], ['NE', 'SF'], ['DEN', 'NYJ'],
    ['BAL', 'BUF'], ['LAC', 'KC'], ['CAR', 'CIN'], ['LV', 'CLE'],
    ['IND', 'PIT'], ['JAX', 'HOU'], ['TEN', 'MIA'], ['NO', 'ATL'],
  ];

  // Week 5
  const week5: [string, string][] = [
    ['CIN', 'BAL'], ['DAL', 'PIT'], ['WAS', 'CLE'], ['MIN', 'NYJ'],
    ['MIA', 'NE'], ['HOU', 'BUF'], ['JAX', 'IND'], ['SEA', 'TEN'],
    ['LV', 'DEN'], ['KC', 'LAC'], ['CHI', 'CAR'], ['PHI', 'DET'],
    ['LAR', 'GB'], ['SF', 'ARI'], ['TB', 'ATL'], ['NYG', 'NO'],
  ];

  // Week 6
  const week6: [string, string][] = [
    ['CLE', 'PHI'], ['LV', 'PIT'], ['DET', 'DAL'], ['BAL', 'WAS'],
    ['CIN', 'NYG'], ['HOU', 'NE'], ['JAX', 'CHI'], ['TEN', 'IND'],
    ['SF', 'MIA'], ['NYJ', 'BUF'], ['CAR', 'ATL'], ['TB', 'NO'],
    ['ARI', 'GB'], ['DEN', 'LAR'], ['SEA', 'MIN'], ['LAC', 'KC'],
  ];

  // Week 7
  const week7: [string, string][] = [
    ['KC', 'SF'], ['DET', 'HOU'], ['TB', 'BAL'], ['CLE', 'CIN'],
    ['NYJ', 'PIT'], ['JAX', 'NE'], ['IND', 'MIA'], ['SEA', 'TEN'],
    ['LV', 'DEN'], ['LAC', 'ARI'], ['CHI', 'CAR'], ['PHI', 'WAS'],
    ['LAR', 'GB'], ['BUF', 'NYG'], ['ATL', 'NO'], ['DAL', 'MIN'],
  ];

  // Week 8
  const week8: [string, string][] = [
    ['MIA', 'ARI'], ['PHI', 'CIN'], ['CLE', 'BAL'], ['NE', 'NYJ'],
    ['PIT', 'NYG'], ['SEA', 'BUF'], ['IND', 'HOU'], ['GB', 'JAX'],
    ['DET', 'TEN'], ['WAS', 'CHI'], ['SF', 'DAL'], ['TB', 'ATL'],
    ['LAC', 'NO'], ['LAR', 'MIN'], ['LV', 'KC'], ['CAR', 'DEN'],
  ];

  // Week 9
  const week9: [string, string][] = [
    ['HOU', 'NYJ'], ['TEN', 'NE'], ['MIA', 'BUF'], ['BAL', 'CIN'],
    ['LAC', 'CLE'], ['WAS', 'PIT'], ['ATL', 'DAL'], ['JAX', 'PHI'],
    ['CAR', 'NYG'], ['ARI', 'CHI'], ['GB', 'DET'], ['IND', 'MIN'],
    ['TB', 'NO'], ['SF', 'LAR'], ['DEN', 'KC'], ['SEA', 'LV'],
  ];

  // Week 10
  const week10: [string, string][] = [
    ['PIT', 'WAS'], ['CIN', 'BAL'], ['NE', 'CLE'], ['ARI', 'NYJ'],
    ['LAR', 'MIA'], ['IND', 'BUF'], ['DET', 'HOU'], ['MIN', 'JAX'],
    ['KC', 'TEN'], ['CHI', 'GB'], ['PHI', 'DAL'], ['NO', 'ATL'],
    ['CAR', 'NYG'], ['TB', 'SF'], ['LAC', 'SEA'], ['DEN', 'LV'],
  ];

  // Week 11
  const week11: [string, string][] = [
    ['WAS', 'PHI'], ['HOU', 'DAL'], ['CHI', 'NYG'], ['LAC', 'CIN'],
    ['PIT', 'CLE'], ['BAL', 'IND'], ['KC', 'BUF'], ['LV', 'MIA'],
    ['LAR', 'NE'], ['NYJ', 'TEN'], ['DET', 'JAX'], ['MIN', 'SEA'],
    ['ARI', 'CAR'], ['ATL', 'DEN'], ['SF', 'TB'], ['GB', 'NO'],
  ];

  // Week 12
  const week12: [string, string][] = [
    ['CAR', 'KC'], ['DEN', 'LV'], ['BAL', 'LAC'], ['CLE', 'PIT'],
    ['NYJ', 'CIN'], ['DAL', 'HOU'], ['DET', 'IND'], ['CHI', 'JAX'],
    ['TEN', 'MIA'], ['NE', 'BUF'], ['SF', 'ATL'], ['NO', 'TB'],
    ['NYG', 'PHI'], ['LAR', 'WAS'], ['MIN', 'GB'], ['ARI', 'SEA'],
  ];

  // Week 13
  const week13: [string, string][] = [
    ['ATL', 'LAC'], ['PHI', 'BAL'], ['PIT', 'CIN'], ['DEN', 'CLE'],
    ['SEA', 'NYJ'], ['IND', 'NE'], ['GB', 'MIA'], ['SF', 'BUF'],
    ['HOU', 'JAX'], ['LV', 'KC'], ['WAS', 'TEN'], ['DET', 'CHI'],
    ['ARI', 'MIN'], ['LAR', 'NO'], ['CAR', 'TB'], ['NYG', 'DAL'],
  ];

  // Week 14
  const week14: [string, string][] = [
    ['CLE', 'PIT'], ['LAR', 'BAL'], ['DAL', 'CIN'], ['MIA', 'NYJ'],
    ['BUF', 'NE'], ['TEN', 'HOU'], ['IND', 'JAX'], ['LAC', 'KC'],
    ['DEN', 'LV'], ['WAS', 'CHI'], ['PHI', 'CAR'], ['ATL', 'MIN'],
    ['NO', 'GB'], ['TB', 'DET'], ['SF', 'SEA'], ['ARI', 'NYG'],
  ];

  // Week 15
  const week15: [string, string][] = [
    ['KC', 'CLE'], ['TEN', 'CIN'], ['PHI', 'PIT'], ['NYG', 'BAL'],
    ['JAX', 'NYJ'], ['ARI', 'NE'], ['DET', 'BUF'], ['HOU', 'MIA'],
    ['DEN', 'IND'], ['CAR', 'DAL'], ['LV', 'ATL'], ['LAC', 'TB'],
    ['MIN', 'CHI'], ['WAS', 'NO'], ['SEA', 'GB'], ['LAR', 'SF'],
  ];

  // Week 16
  const week16: [string, string][] = [
    ['KC', 'HOU'], ['CIN', 'DEN'], ['BAL', 'PIT'], ['NYJ', 'CLE'],
    ['BUF', 'NE'], ['SF', 'MIA'], ['LV', 'JAX'], ['IND', 'TEN'],
    ['TB', 'DAL'], ['WAS', 'PHI'], ['ATL', 'NYG'], ['ARI', 'CAR'],
    ['DET', 'CHI'], ['GB', 'MIN'], ['LAR', 'NO'], ['SEA', 'LAC'],
  ];

  // Week 17
  const week17: [string, string][] = [
    ['PIT', 'KC'], ['HOU', 'BAL'], ['DEN', 'CIN'], ['LAC', 'CLE'],
    ['BUF', 'NYJ'], ['LV', 'NE'], ['MIA', 'ARI'], ['NYG', 'IND'],
    ['TEN', 'JAX'], ['PHI', 'DAL'], ['ATL', 'WAS'], ['CAR', 'TB'],
    ['SEA', 'CHI'], ['SF', 'DET'], ['MIN', 'GB'], ['LAR', 'NO'],
  ];

  // Week 18 - Final week
  const week18: [string, string][] = [
    ['CIN', 'PIT'], ['CLE', 'BAL'], ['NE', 'BUF'], ['NYJ', 'MIA'],
    ['TEN', 'HOU'], ['JAX', 'IND'], ['DEN', 'KC'], ['LV', 'LAC'],
    ['WAS', 'DAL'], ['NYG', 'PHI'], ['MIN', 'DET'], ['CHI', 'GB'],
    ['CAR', 'ATL'], ['NO', 'TB'], ['ARI', 'SF'], ['LAR', 'SEA'],
  ];

  const allWeeks: [string, string][][] = [
    week1, week2, week3, week4, week5, week6, week7, week8, week9,
    week10, week11, week12, week13, week14, week15, week16, week17, week18
  ];

  allWeeks.forEach((weekMatchups, weekIdx) => {
    const weekNum = weekIdx + 1;
    games[String(weekNum)] = weekMatchups.map((matchup, idx) => {
      const [away, home] = matchup;
      const homeRating = TEAM_RATINGS[home] || 0;
      const awayRating = TEAM_RATINGS[away] || 0;
      // Calculate win probability with home field advantage
      const margin = homeRating - awayRating + 1.7;
      const wp = 1 / (1 + Math.exp(-0.107 * margin));
      
      return {
        id: gameId++,
        week: weekNum,
        away,
        home,
        pIndex: idx,
        wp: Math.max(0.15, Math.min(0.85, wp)), // Clamp between 15% and 85%
        done: false,
        hs: 0,
        as: 0,
      };
    });
  });

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
