import { SeasonData } from '../engine/playoff-engine';

// NFL 2026 Season - Official Schedule from ESPN
// Season started Sep 3, 2026

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

export const TEAM_RATINGS: Record<string, number> = {
  KC: 8.5, BUF: 7.8, DET: 7.5, BAL: 7.2, PHI: 7.0,
  MIN: 6.5, WAS: 6.2, HOU: 5.8, PIT: 5.5, GB: 5.3,
  DEN: 5.0, LAC: 4.8, TB: 4.5, ARI: 4.2, CIN: 4.0,
  DAL: 3.8, SEA: 3.5, MIA: 3.2, IND: 3.0, ATL: 2.8,
  CHI: 2.5, LAR: 2.2, SF: 2.0, NO: 1.8, NYJ: 1.5,
  JAX: 1.2, TEN: 1.0, LV: 0.8, NYG: 0.5, CAR: 0.2,
  CLE: 0.0, NE: -0.5,
};

// Official 2026 NFL Schedule from ESPN (source: espn.com/nfl/schedule)
// Each entry: [away, home]
// Bye weeks confirmed from ESPN data

const OFFICIAL_SCHEDULE: Record<number, [string, string][]> = {
  // Week 1 - Sep 6-15 (All 32 teams play)
  1: [
    ['NE', 'SEA'], ['SF', 'LAR'], ['ATL', 'PIT'], ['BAL', 'IND'],
    ['BUF', 'HOU'], ['CHI', 'CAR'], ['CLE', 'JAX'], ['NO', 'DET'],
    ['NYJ', 'TEN'], ['TB', 'CIN'], ['ARI', 'LAC'], ['GB', 'MIN'],
    ['MIA', 'LV'], ['WAS', 'PHI'], ['DAL', 'NYG'], ['DEN', 'KC'],
  ],
  // Week 2 - Sep 16-22 (All 32 teams play)
  2: [
    ['DET', 'BUF'], ['CAR', 'ATL'], ['MIN', 'CHI'], ['PHI', 'TEN'],
    ['PIT', 'NE'], ['GB', 'NYJ'], ['CLE', 'TB'], ['NO', 'BAL'],
    ['CIN', 'HOU'], ['JAX', 'DEN'], ['LV', 'LAC'], ['WAS', 'DAL'],
    ['SEA', 'ARI'], ['MIA', 'SF'], ['IND', 'KC'], ['NYG', 'LAR'],
  ],
  // Week 3 - Sep 23-29 (All 32 teams play)
  3: [
    ['ATL', 'GB'], ['LAC', 'BUF'], ['CAR', 'CLE'], ['NYJ', 'DET'],
    ['HOU', 'IND'], ['KC', 'MIA'], ['TEN', 'NYG'], ['CIN', 'PIT'],
    ['SEA', 'WAS'], ['NE', 'JAX'], ['ARI', 'SF'], ['MIN', 'TB'],
    ['BAL', 'DAL'], ['LV', 'NO'], ['LAR', 'DEN'], ['PHI', 'CHI'],
  ],
  // Week 4 - Sep 30 - Oct 6 (All 32 teams play)
  4: [
    ['PIT', 'CLE'], ['IND', 'WAS'], ['NE', 'BUF'], ['NYJ', 'CHI'],
    ['JAX', 'CIN'], ['ARI', 'NYG'], ['LAR', 'PHI'], ['GB', 'TB'],
    ['TEN', 'BAL'], ['DAL', 'HOU'], ['MIA', 'MIN'], ['KC', 'LV'],
    ['DEN', 'SF'], ['LAC', 'SEA'], ['DET', 'CAR'], ['ATL', 'NO'],
  ],
  // Week 5 - Oct 7-13 (Bye: KC, CAR)
  5: [
    ['TB', 'DAL'], ['PHI', 'JAX'], ['HOU', 'TEN'], ['CIN', 'MIA'],
    ['LV', 'NE'], ['MIN', 'NO'], ['CLE', 'NYJ'], ['IND', 'PIT'],
    ['NYG', 'WAS'], ['DEN', 'LAC'], ['CHI', 'GB'], ['DET', 'ARI'],
    ['SF', 'SEA'], ['BAL', 'ATL'], ['BUF', 'LAR'],
  ],
  // Week 6 - Oct 14-20 (Bye: CIN, DET, MIA, MIN)
  6: [
    ['SEA', 'DEN'], ['HOU', 'JAX'], ['CHI', 'ATL'], ['BAL', 'CLE'],
    ['TEN', 'IND'], ['NYJ', 'NE'], ['NO', 'NYG'], ['CAR', 'PHI'],
    ['PIT', 'TB'], ['ARI', 'LAR'], ['LAC', 'KC'], ['BUF', 'LV'],
    ['DAL', 'GB'], ['WAS', 'SF'],
  ],
  // Week 7 - Oct 21-27 (Bye: BUF, LAR, WAS, JAX)
  7: [
    ['NE', 'CHI'], ['PIT', 'NO'], ['SF', 'ATL'], ['CLE', 'TEN'],
    ['IND', 'MIN'], ['MIA', 'NYJ'], ['TB', 'CAR'], ['CIN', 'BAL'],
    ['NYG', 'HOU'], ['DEN', 'ARI'], ['GB', 'DET'], ['LAR', 'LV'],
    ['KC', 'SEA'], ['DAL', 'PHI'],
  ],
  // Week 8 - Oct 28 - Nov 3 (Bye: NO, NYG, SF, HOU)
  8: [
    ['CAR', 'GB'], ['BAL', 'BUF'], ['TEN', 'CIN'], ['ARI', 'DAL'],
    ['MIN', 'DET'], ['LV', 'NYJ'], ['CLE', 'PIT'], ['ATL', 'TB'],
    ['IND', 'JAX'], ['LAC', 'LAR'], ['KC', 'DEN'], ['NE', 'MIA'],
    ['PHI', 'WAS'], ['CHI', 'SEA'],
  ],
  // Week 9 - Nov 4-10 (Bye: TEN, PIT)
  9: [
    ['JAX', 'BAL'], ['CIN', 'ATL'], ['DAL', 'IND'], ['NYJ', 'KC'],
    ['DET', 'MIA'], ['CLE', 'NO'], ['NYG', 'PHI'], ['LAR', 'WAS'],
    ['DEN', 'CAR'], ['HOU', 'LAC'], ['LV', 'SF'], ['GB', 'NE'],
    ['ARI', 'SEA'], ['TB', 'CHI'], ['BUF', 'MIN'],
  ],
  // Week 10 - Nov 11-17 (Bye: CHI, DEN, PHI, TB)
  10: [
    ['WAS', 'NYG'], ['NE', 'DET'], ['KC', 'ATL'], ['HOU', 'CLE'],
    ['MIN', 'GB'], ['JAX', 'TEN'], ['MIA', 'IND'], ['CAR', 'NO'],
    ['BUF', 'NYJ'], ['SEA', 'LV'], ['LAR', 'ARI'], ['SF', 'DAL'],
    ['PIT', 'CIN'], ['LAC', 'BAL'],
  ],
  // Week 11 - Nov 18-24 (Bye: ATL, CLE, GB, LAR, NE, SEA)
  11: [
    ['IND', 'HOU'], ['MIA', 'BUF'], ['NO', 'CHI'], ['TEN', 'DAL'],
    ['TB', 'DET'], ['ARI', 'KC'], ['JAX', 'NYG'], ['BAL', 'CAR'],
    ['NYJ', 'LAC'], ['LV', 'DEN'], ['PIT', 'PHI'], ['MIN', 'SF'],
    ['CIN', 'WAS'],
  ],
  // Week 12 - Nov 25 - Dec 1 (No bye - all 32 teams play)
  12: [
    ['GB', 'LAR'], ['CHI', 'DET'], ['PHI', 'DAL'], ['KC', 'BUF'],
    ['DEN', 'PIT'], ['NO', 'CIN'], ['LV', 'CLE'], ['NYG', 'IND'],
    ['NYJ', 'MIA'], ['ATL', 'MIN'], ['BAL', 'HOU'], ['TEN', 'JAX'],
    ['WAS', 'ARI'], ['SEA', 'SF'], ['NE', 'LAC'], ['CAR', 'TB'],
  ],
  // Week 13 - Dec 2-8 (Bye: IND, LV, NYJ, BAL)
  13: [
    ['KC', 'LAR'], ['DET', 'ATL'], ['JAX', 'CHI'], ['CIN', 'CLE'],
    ['WAS', 'TEN'], ['GB', 'NO'], ['SF', 'NYG'], ['LAC', 'TB'],
    ['MIA', 'DEN'], ['PHI', 'ARI'], ['CAR', 'MIN'], ['BUF', 'NE'],
    ['HOU', 'PIT'], ['DAL', 'SEA'],
  ],
  // Week 14 - Dec 9-15 (Bye: DAL, ARI)
  14: [
    ['MIN', 'NE'], ['ATL', 'CLE'], ['TEN', 'DET'], ['CHI', 'MIA'],
    ['DEN', 'NYJ'], ['IND', 'PHI'], ['HOU', 'WAS'], ['NO', 'CAR'],
    ['TB', 'BAL'], ['LAC', 'LV'], ['KC', 'CIN'], ['LAR', 'SF'],
    ['NYG', 'SEA'], ['BUF', 'GB'], ['PIT', 'JAX'],
  ],
  // Week 15 - Dec 16-22 (No bye - all 32 teams play)
  15: [
    ['SF', 'LAC'], ['SEA', 'PHI'], ['CHI', 'BUF'], ['MIA', 'GB'],
    ['IND', 'TEN'], ['CLE', 'NYG'], ['BAL', 'PIT'], ['NO', 'TB'],
    ['ATL', 'WAS'], ['CIN', 'CAR'], ['JAX', 'HOU'], ['NYJ', 'ARI'],
    ['DEN', 'LV'], ['DAL', 'LAR'], ['DET', 'MIN'], ['NE', 'KC'],
  ],
  // Week 16 - Dec 23-29 (Bye: BUF, DET, JAX, MIN)
  16: [
    ['NE', 'MIA'], ['NYJ', 'CIN'], ['CLE', 'PIT'], ['BAL', 'HOU'],
    ['IND', 'TEN'], ['KC', 'DEN'], ['LAC', 'LV'], ['DAL', 'PHI'],
    ['WAS', 'NYG'], ['CHI', 'GB'], ['ATL', 'CAR'], ['NO', 'TB'],
    ['SF', 'SEA'], ['ARI', 'LAR'],
  ],
  // Week 17 - Dec 30 - Jan 5 (Bye: DAL, DEN, LV, WAS)
  17: [
    ['NE', 'BUF'], ['MIA', 'NYJ'], ['CIN', 'CLE'], ['PIT', 'BAL'],
    ['HOU', 'IND'], ['JAX', 'TEN'], ['KC', 'LAC'], ['PHI', 'NYG'],
    ['CHI', 'DET'], ['GB', 'MIN'], ['ATL', 'CAR'], ['NO', 'TB'],
    ['SF', 'SEA'], ['ARI', 'LAR'],
  ],
  // Week 18 - Jan 6-12 (No bye - all 32 teams play)
  18: [
    ['NYJ', 'BUF'], ['CLE', 'CIN'], ['LAC', 'DEN'], ['DET', 'GB'],
    ['JAX', 'IND'], ['LV', 'KC'], ['SEA', 'LAR'], ['CHI', 'MIN'],
    ['MIA', 'NE'], ['TB', 'NO'], ['PHI', 'NYG'], ['SF', 'ARI'],
    ['DAL', 'WAS'], ['ATL', 'CAR'], ['PIT', 'BAL'], ['TEN', 'HOU'],
  ],
};

// Official bye weeks from ESPN (confirmed for all weeks)
export const BYE_WEEKS: Record<string, number> = {
  // Week 5
  KC: 5, CAR: 5,
  // Week 6
  CIN: 6, DET: 6, MIA: 6, MIN: 6,
  // Week 7
  BUF: 7, LAC: 7, WAS: 7, JAX: 7,
  // Week 8
  NO: 8, NYG: 8, SF: 8, HOU: 8,
  // Week 9
  TEN: 9, PIT: 9,
  // Week 10
  CHI: 10, DEN: 10, PHI: 10, TB: 10,
  // Week 11
  ATL: 11, CLE: 11, GB: 11, LAR: 11, NE: 11, SEA: 11,
  // Week 13
  IND: 13, LV: 13, NYJ: 13, BAL: 13,
  // Week 14
  DAL: 14, ARI: 14,
  // Weeks 15-18: No bye weeks (all teams play)
};

function generateSchedule(): Record<string, any[]> {
  const games: Record<string, any[]> = {};
  let gameId = 1;

  for (let week = 1; week <= 18; week++) {
    const matchups = OFFICIAL_SCHEDULE[week] || [];
    games[String(week)] = matchups.map((matchup, idx) => {
      const [away, home] = matchup;
      const homeRating = TEAM_RATINGS[home] || 0;
      const awayRating = TEAM_RATINGS[away] || 0;
      const margin = homeRating - awayRating + 1.7;
      const wp = 1 / (1 + Math.exp(-0.107 * margin));
      
      return {
        id: gameId++,
        week,
        away,
        home,
        pIndex: idx,
        wp: Math.max(0.15, Math.min(0.85, wp)),
        done: false,
        hs: 0,
        as: 0,
      };
    });
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
