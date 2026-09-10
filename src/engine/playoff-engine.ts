// NFL Playoff Engine - TypeScript port
// Based on the original playoff-engine.js

export const EPS = 0.001;

export interface TeamRecord {
  team: string;
  conf: string;
  div: string;
  w: number;
  l: number;
  t: number;
  dw: number;
  dl: number;
  dt: number;
  cw: number;
  cl: number;
  ct: number;
  h2hW: Record<string, number>;
  h2hL: Record<string, number>;
  h2hT: Record<string, number>;
  opps: string[];
  pf: number;
  pa: number;
}

export interface GameRow {
  id: number;
  week: number;
  away: string;
  home: string;
  pIndex: number;
  wp: number;
  done: boolean;
  hs: number;
  as: number;
  sameDiv: boolean;
  sameConf: boolean;
}

export interface FlatGame extends GameRow {}

export interface SeedEntry {
  seed: number;
  team: string;
  rec: TeamRecord;
  isDivisionWinner: boolean;
}

export interface PostGame {
  id: string;
  conf: string;
  round: string;
  higher: SeedEntry;
  lower: SeedEntry;
  winner: string;
  isUserPick: boolean;
  higherWinProb: number;
}

export interface PostseasonResult {
  games: PostGame[];
  eliminations: Record<string, number>;
  champion: string | null;
  anyUserPick: boolean;
}

export interface StandingsResult {
  recs: Record<string, TeamRecord>;
  list: TeamRecord[];
}

export interface DivisionsMap {
  [conf: string]: {
    [div: string]: string[];
  };
}

export interface Ratings {
  [team: string]: number;
}

export interface SeasonData {
  divisions: DivisionsMap;
  games: Record<string, GameRow[]>;
  norm?: Record<string, string>;
  ratings?: Ratings;
  simCount?: number;
  _flat?: FlatGame[];
  _shareOrdered?: FlatGame[];
}

export interface MonteCarloResult {
  makePlayoffs: number;
  winDivision: number;
  topSeed: number;
  seedDist: Record<number, number>;
  superBowl: number;
  championship: number;
  draftAvg: number;
  draftBest: number;
  draftWorst: number;
}

export function makeRec(team: string, conf: string, div: string): TeamRecord {
  return {
    team, conf, div,
    w: 0, l: 0, t: 0,
    dw: 0, dl: 0, dt: 0,
    cw: 0, cl: 0, ct: 0,
    h2hW: {}, h2hL: {}, h2hT: {},
    opps: [],
    pf: 0, pa: 0,
  };
}

export function winPct(r: TeamRecord): number {
  const g = r.w + r.l + r.t;
  return g === 0 ? 0 : (r.w + 0.5 * r.t) / g;
}

export function divPct(r: TeamRecord): number {
  const g = r.dw + r.dl + r.dt;
  return g === 0 ? 0 : (r.dw + 0.5 * r.dt) / g;
}

export function confPct(r: TeamRecord): number {
  const g = r.cw + r.cl + r.ct;
  return g === 0 ? 0 : (r.cw + 0.5 * r.ct) / g;
}

export function netPoints(r: TeamRecord): number {
  return r.pf - r.pa;
}

export function recStr(r: TeamRecord): string {
  return r.t > 0 ? `${r.w}-${r.l}-${r.t}` : `${r.w}-${r.l}`;
}

export function flattenGames(data: SeasonData): FlatGame[] {
  if (data._flat) return data._flat;
  const norm = data.norm || {};
  const teamDiv: Record<string, string> = {};
  for (const conf in data.divisions) {
    for (const div in data.divisions[conf]) {
      data.divisions[conf][div].forEach((t) => {
        teamDiv[t] = conf + '|' + div;
      });
    }
  }
  const flat: FlatGame[] = [];
  Object.keys(data.games).map(Number).sort((a, b) => a - b)
    .forEach((wk) => {
      data.games[String(wk)].forEach((g) => {
        const away = norm[g.away] || g.away;
        const home = norm[g.home] || g.home;
        flat.push({
          id: g.id, week: wk, away, home,
          pIndex: g.pIndex, wp: g.wp, done: Boolean(g.done),
          hs: g.hs, as: g.as,
          sameDiv: teamDiv[away] === teamDiv[home],
          sameConf: !!(teamDiv[away] && teamDiv[home] &&
            teamDiv[away].split('|')[0] === teamDiv[home].split('|')[0]),
        });
      });
    });
  data._flat = flat;
  return flat;
}

export function shareOrderedGames(data: SeasonData): FlatGame[] {
  if (data._shareOrdered) return data._shareOrdered;
  data._shareOrdered = flattenGames(data).slice()
    .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  return data._shareOrdered;
}

export function computeStandings(data: SeasonData, picks: Record<number, string> = {}): StandingsResult {
  const recs: Record<string, TeamRecord> = {};
  const list: TeamRecord[] = [];
  for (const conf in data.divisions) {
    for (const div in data.divisions[conf]) {
      data.divisions[conf][div].forEach((t) => {
        recs[t] = makeRec(t, conf, div);
        list.push(recs[t]);
      });
    }
  }

  flattenGames(data).forEach((g) => {
    const home = recs[g.home];
    const away = recs[g.away];
    if (!home || !away) return;

    let winner: TeamRecord | null = null;
    let isReal = false;
    if (g.done) {
      isReal = true;
      if (g.hs > g.as) winner = home;
      else if (g.as > g.hs) winner = away;
    } else {
      const side = picks[g.id];
      if (side !== 'h' && side !== 'a') return;
      winner = side === 'h' ? home : away;
    }

    home.opps.push(away.team);
    away.opps.push(home.team);
    if (isReal) {
      home.pf += g.hs; home.pa += g.as;
      away.pf += g.as; away.pa += g.hs;
    }

    if (winner === null) {
      home.t++; away.t++;
      home.h2hT[away.team] = (home.h2hT[away.team] || 0) + 1;
      away.h2hT[home.team] = (away.h2hT[home.team] || 0) + 1;
      if (g.sameDiv) { home.dt++; away.dt++; }
      if (g.sameConf) { home.ct++; away.ct++; }
      return;
    }

    const loser = winner === home ? away : home;
    winner.w++; loser.l++;
    winner.h2hW[loser.team] = (winner.h2hW[loser.team] || 0) + 1;
    loser.h2hL[winner.team] = (loser.h2hL[winner.team] || 0) + 1;
    if (g.sameDiv) { winner.dw++; loser.dl++; }
    if (g.sameConf) { winner.cw++; loser.cl++; }
  });

  return { recs, list };
}

function h2hPct(r: TeamRecord, opp: string): number {
  const w = r.h2hW[opp] || 0, l = r.h2hL[opp] || 0, t = r.h2hT[opp] || 0;
  const g = w + l + t;
  return g === 0 ? 0.5 : (w + 0.5 * t) / g;
}

function h2hPctVsGroup(r: TeamRecord, opps: string[]): number {
  let w = 0, l = 0, t = 0;
  opps.forEach((o) => {
    w += r.h2hW[o] || 0; l += r.h2hL[o] || 0; t += r.h2hT[o] || 0;
  });
  const g = w + l + t;
  return g === 0 ? 0.5 : (w + 0.5 * t) / g;
}

function commonPct(r: TeamRecord, other: TeamRecord): number | null {
  const mine: Record<string, boolean> = {};
  r.opps.forEach((o) => { mine[o] = true; });
  const seen: Record<string, boolean> = {};
  const common: string[] = [];
  other.opps.forEach((o) => {
    if (mine[o] && !seen[o]) { seen[o] = true; common.push(o); }
  });
  if (common.length === 0) return null;
  let w = 0, l = 0, t = 0;
  common.forEach((o) => {
    w += r.h2hW[o] || 0; l += r.h2hL[o] || 0; t += r.h2hT[o] || 0;
  });
  const g = w + l + t;
  if (g < 4) return null;
  return (w + 0.5 * t) / g;
}

function sov(r: TeamRecord, recs: Record<string, TeamRecord>): number {
  let total = 0, count = 0;
  for (const opp in r.h2hW) {
    const o = recs[opp];
    if (o) { total += winPct(o) * r.h2hW[opp]; count += r.h2hW[opp]; }
  }
  return count > 0 ? total / count : 0;
}

function sos(r: TeamRecord, recs: Record<string, TeamRecord>): number {
  if (r.opps.length === 0) return 0;
  let total = 0;
  r.opps.forEach((opp) => {
    const o = recs[opp];
    if (o) total += winPct(o);
  });
  return total / r.opps.length;
}

function ladderTail(a: TeamRecord, b: TeamRecord, recs: Record<string, TeamRecord>, commonFirst: boolean): number {
  const ac = commonPct(a, b), bc = commonPct(b, a);
  function commonStep(): number {
    if (ac !== null && bc !== null && Math.abs(ac - bc) > EPS) {
      return ac > bc ? -1 : 1;
    }
    return 0;
  }
  let r: number;
  if (commonFirst) { r = commonStep(); if (r) return r; }
  const confDiff = confPct(b) - confPct(a);
  if (Math.abs(confDiff) > EPS) return confDiff > 0 ? 1 : -1;
  if (!commonFirst) { r = commonStep(); if (r) return r; }
  const aSov = sov(a, recs), bSov = sov(b, recs);
  if (Math.abs(aSov - bSov) > EPS) return aSov > bSov ? -1 : 1;
  const aSos = sos(a, recs), bSos = sos(b, recs);
  if (Math.abs(aSos - bSos) > EPS) return aSos > bSos ? -1 : 1;
  if (netPoints(a) !== netPoints(b)) {
    return netPoints(a) > netPoints(b) ? -1 : 1;
  }
  return 0;
}

function cmpDivision(a: TeamRecord, b: TeamRecord, recs: Record<string, TeamRecord>, skipH2H: boolean): number {
  const wpDiff = winPct(b) - winPct(a);
  if (Math.abs(wpDiff) > EPS) return wpDiff > 0 ? 1 : -1;
  if (!skipH2H) {
    const ah = h2hPct(a, b.team), bh = h2hPct(b, a.team);
    if (Math.abs(ah - bh) > EPS) return ah > bh ? -1 : 1;
  }
  const dDiff = divPct(b) - divPct(a);
  if (Math.abs(dDiff) > EPS) return dDiff > 0 ? 1 : -1;
  return ladderTail(a, b, recs, true);
}

function cmpConference(a: TeamRecord, b: TeamRecord, recs: Record<string, TeamRecord>, skipH2H: boolean): number {
  const wpDiff = winPct(b) - winPct(a);
  if (Math.abs(wpDiff) > EPS) return wpDiff > 0 ? 1 : -1;
  if (!skipH2H) {
    const aVsB = a.h2hW[b.team] || 0, bVsA = b.h2hW[a.team] || 0;
    if (aVsB + bVsA > 0 && aVsB !== bVsA) return aVsB > bVsA ? -1 : 1;
  }
  return ladderTail(a, b, recs, false);
}

function cmp(a: TeamRecord, b: TeamRecord, recs: Record<string, TeamRecord>, isDivision: boolean, skipH2H: boolean): number {
  return isDivision
    ? cmpDivision(a, b, recs, skipH2H)
    : cmpConference(a, b, recs, skipH2H);
}

function resolveMultiTeamTie(tied: TeamRecord[], recs: Record<string, TeamRecord>, isDivision: boolean): TeamRecord[] {
  if (tied.length <= 1) return tied.slice();
  if (tied.length === 2) {
    return cmp(tied[0], tied[1], recs, isDivision, false) <= 0
      ? tied.slice() : [tied[1], tied[0]];
  }
  const names = tied.map((t) => t.team);
  let sweepWinner: TeamRecord | null = null, sweepLoser: TeamRecord | null = null;
  for (let i = 0; i < tied.length; i++) {
    const others = names.filter((n) => n !== tied[i].team);
    const p = h2hPctVsGroup(tied[i], others);
    if (p >= 0.999) { sweepWinner = tied[i]; break; }
    if (p <= 0.001) sweepLoser = tied[i];
  }
  if (sweepWinner) {
    const rest = tied.filter((t) => t !== sweepWinner);
    return [sweepWinner].concat(resolveMultiTeamTie(rest, recs, isDivision));
  }
  if (sweepLoser) {
    const rest2 = tied.filter((t) => t !== sweepLoser);
    return resolveMultiTeamTie(rest2, recs, isDivision).concat([sweepLoser]);
  }
  const sorted = tied.slice();
  sorted.sort((a, b) => {
    const ah = h2hPctVsGroup(a, names.filter((n) => n !== a.team));
    const bh = h2hPctVsGroup(b, names.filter((n) => n !== b.team));
    if (Math.abs(ah - bh) > EPS) return ah > bh ? -1 : 1;
    return cmp(a, b, recs, isDivision, true);
  });
  return sorted;
}

export function sortWithMultiTeamTiebreaker(teams: TeamRecord[], recs: Record<string, TeamRecord>, isDivision: boolean): TeamRecord[] {
  if (teams.length <= 1) return teams.slice();
  if (teams.length === 2) {
    return cmp(teams[0], teams[1], recs, isDivision, false) <= 0
      ? teams.slice() : [teams[1], teams[0]];
  }
  const byPct: Record<string, TeamRecord[]> = {};
  const pcts: number[] = [];
  teams.forEach((t) => {
    const key = String(Math.round(winPct(t) * 1000) / 1000);
    if (!byPct[key]) { byPct[key] = []; pcts.push(Math.round(winPct(t) * 1000) / 1000); }
    byPct[key].push(t);
  });
  pcts.sort((a, b) => b - a);
  let out: TeamRecord[] = [];
  pcts.forEach((p) => {
    const group = byPct[String(p)];
    if (group.length === 1) out.push(group[0]);
    else out = out.concat(resolveMultiTeamTie(group, recs, isDivision));
  });
  return out;
}

export function seedConference(standings: StandingsResult, data: SeasonData, conf: string): SeedEntry[] {
  const recs = standings.recs;
  const divisionWinners: TeamRecord[] = [];
  const others: TeamRecord[] = [];
  for (const div in data.divisions[conf]) {
    const teams = data.divisions[conf][div].map((t) => recs[t]);
    const sorted = sortWithMultiTeamTiebreaker(teams, recs, true);
    divisionWinners.push(sorted[0]);
    others.push(...sorted.slice(1));
  }
  const sortedWinners = sortWithMultiTeamTiebreaker(divisionWinners, recs, false);
  const wildCards = sortWithMultiTeamTiebreaker(others, recs, false).slice(0, 3);
  const seeds: SeedEntry[] = [];
  sortedWinners.forEach((r, i) => {
    seeds.push({ seed: i + 1, team: r.team, rec: r, isDivisionWinner: true });
  });
  wildCards.forEach((r, i) => {
    seeds.push({ seed: i + 5, team: r.team, rec: r, isDivisionWinner: false });
  });
  return seeds;
}

function matchupHomeProb(ratings: Ratings, home: string, away: string, neutral: boolean): number {
  const rh = ratings[home] || 0;
  const ra = ratings[away] || 0;
  const margin = rh - ra + (neutral ? 0 : 1.7);
  return 1 / (1 + Math.exp(-0.107 * margin));
}

function chalkBeats(a: SeedEntry, b: SeedEntry): SeedEntry {
  const ap = winPct(a.rec), bp = winPct(b.rec);
  if (ap !== bp) return ap > bp ? a : b;
  return a.seed < b.seed ? a : b;
}

export function resolvePostseason(afcSeeds: SeedEntry[], nfcSeeds: SeedEntry[], playoffPicks: Record<string, string> = {}, ratings: Ratings = {}): PostseasonResult {
  const haveRatings = ratings && Object.keys(ratings).length > 0;
  const games: PostGame[] = [];
  const eliminations: Record<string, number> = {};
  let anyUserPick = false;

  function play(conf: string, round: string, higher: SeedEntry, lower: SeedEntry, elimRound: number): PostGame {
    const id = conf + '|' + round + '|' + higher.team + '@' + lower.team;
    const neutral = conf === 'SB';
    const p = haveRatings
      ? matchupHomeProb(ratings, higher.team, lower.team, neutral)
      : 0.5;
    let winner: SeedEntry;
    let isUserPick = false;
    const picked = playoffPicks[id];
    if (picked === higher.team) { winner = higher; isUserPick = true; }
    else if (picked === lower.team) { winner = lower; isUserPick = true; }
    else if (haveRatings) { winner = p >= 0.5 ? higher : lower; }
    else { winner = chalkBeats(higher, lower); }
    if (isUserPick) anyUserPick = true;
    eliminations[winner === higher ? lower.team : higher.team] = elimRound;
    const game: PostGame = {
      id, conf, round,
      higher, lower,
      winner: winner.team, isUserPick, higherWinProb: p,
    };
    games.push(game);
    return game;
  }

  function winnerOf(g: PostGame): SeedEntry { return g.winner === g.higher.team ? g.higher : g.lower; }

  function playConference(conf: string, seeds: SeedEntry[]): SeedEntry | null {
    if (seeds.length < 7) return null;
    const wc = [
      play(conf, 'Wild Card', seeds[1], seeds[6], 1),
      play(conf, 'Wild Card', seeds[2], seeds[5], 1),
      play(conf, 'Wild Card', seeds[3], seeds[4], 1),
    ];
    const rem = wc.map(winnerOf)
      .sort((a, b) => a.seed - b.seed);
    const divGames = [
      play(conf, 'Divisional', seeds[0], rem[2], 2),
      play(conf, 'Divisional', rem[0], rem[1], 2),
    ];
    const finalists = divGames.map(winnerOf)
      .sort((a, b) => a.seed - b.seed);
    const con = play(conf, 'Championship', finalists[0], finalists[1], 3);
    return winnerOf(con);
  }

  const afcChamp = playConference('AFC', afcSeeds);
  const nfcChamp = playConference('NFC', nfcSeeds);
  let champion: string | null = null;
  if (afcChamp && nfcChamp) {
    const sb = play('SB', 'Super Bowl', afcChamp, nfcChamp, 4);
    champion = sb.winner;
    eliminations[champion] = 5;
  }
  return { games, eliminations, champion, anyUserPick };
}

export function computeDraftOrder(standings: StandingsResult, eliminations: Record<string, number>): string[] {
  const recs = standings.recs;
  function sosOf(r: TeamRecord): number {
    return r.opps.length === 0 ? 0.5 : sos(r, recs);
  }
  function worstFirst(a: TeamRecord, b: TeamRecord): number {
    const d = winPct(a) - winPct(b);
    if (d !== 0) return d < 0 ? -1 : 1;
    const s = sosOf(a) - sosOf(b);
    if (s !== 0) return s < 0 ? -1 : 1;
    return 0;
  }
  const nonPlayoff: TeamRecord[] = [], playoff: TeamRecord[] = [];
  standings.list.forEach((r) => {
    (eliminations[r.team] !== undefined ? playoff : nonPlayoff).push(r);
  });
  nonPlayoff.sort(worstFirst);
  playoff.sort((a, b) => {
    const e = eliminations[a.team] - eliminations[b.team];
    if (e !== 0) return e;
    return worstFirst(a, b);
  });
  return nonPlayoff.concat(playoff).map((r) => r.team);
}

export function runMonteCarlo(data: SeasonData, picks: Record<number, string>, n: number, rng: () => number = Math.random): Record<string, MonteCarloResult> {
  const flat = flattenGames(data);
  const undecided = flat.filter((g) => !g.done && picks[g.id] === undefined);

  const tally: Record<string, any> = {};
  const teams: string[] = [];
  for (const conf in data.divisions) {
    for (const div in data.divisions[conf]) {
      data.divisions[conf][div].forEach((t) => {
        teams.push(t);
        tally[t] = {
          makePlayoffs: 0, winDivision: 0, topSeed: 0,
          seedDist: [0, 0, 0, 0, 0, 0, 0, 0],
          superBowl: 0, championship: 0,
          draftSum: 0, draftBest: 33, draftWorst: 0,
        };
      });
    }
  }

  const simPicks: Record<number, string> = { ...picks };

  for (let sim = 0; sim < n; sim++) {
    for (let i = 0; i < undecided.length; i++) {
      const g = undecided[i];
      simPicks[g.id] = rng() < g.wp ? 'h' : 'a';
    }

    const standings = computeStandings(data, simPicks);
    const afc = seedConference(standings, data, 'AFC');
    const nfc = seedConference(standings, data, 'NFC');

    [afc, nfc].forEach((seeds) => {
      seeds.forEach((s) => {
        const t = tally[s.team];
        t.makePlayoffs++;
        t.seedDist[s.seed]++;
        if (s.isDivisionWinner) t.winDivision++;
        if (s.seed === 1) t.topSeed++;
      });
    });

    const post = resolvePostseasonRandom(afc, nfc, data.ratings || {}, rng);
    for (const team in post.eliminations) {
      const round = post.eliminations[team];
      if (round >= 4) tally[team].superBowl++;
      if (round === 5) tally[team].championship++;
    }

    const order = computeDraftOrder(standings, post.eliminations);
    for (let slot = 0; slot < order.length; slot++) {
      const t2 = tally[order[slot]];
      const pick = slot + 1;
      t2.draftSum += pick;
      if (pick < t2.draftBest) t2.draftBest = pick;
      if (pick > t2.draftWorst) t2.draftWorst = pick;
    }
  }

  const results: Record<string, MonteCarloResult> = {};
  teams.forEach((t) => {
    const c = tally[t];
    const seedDist: Record<number, number> = {};
    for (let s = 1; s <= 7; s++) {
      if (c.seedDist[s] > 0) seedDist[s] = c.seedDist[s] / n;
    }
    results[t] = {
      makePlayoffs: c.makePlayoffs / n,
      winDivision: c.winDivision / n,
      topSeed: c.topSeed / n,
      seedDist,
      superBowl: c.superBowl / n,
      championship: c.championship / n,
      draftAvg: c.draftSum / n,
      draftBest: c.draftBest === 33 ? 0 : c.draftBest,
      draftWorst: c.draftWorst,
    };
  });
  return results;
}

function resolvePostseasonRandom(afcSeeds: SeedEntry[], nfcSeeds: SeedEntry[], ratings: Ratings, rng: () => number): { eliminations: Record<string, number> } {
  const eliminations: Record<string, number> = {};

  function play(higher: SeedEntry, lower: SeedEntry, neutral: boolean, elimRound: number): SeedEntry {
    const p = matchupHomeProb(ratings, higher.team, lower.team, neutral);
    const winner = rng() < p ? higher : lower;
    eliminations[winner === higher ? lower.team : higher.team] = elimRound;
    return winner;
  }

  function playConference(seeds: SeedEntry[]): SeedEntry | null {
    if (seeds.length < 7) return null;
    const wc = [
      play(seeds[1], seeds[6], false, 1),
      play(seeds[2], seeds[5], false, 1),
      play(seeds[3], seeds[4], false, 1),
    ].sort((a, b) => a.seed - b.seed);
    const divW = [
      play(seeds[0], wc[2], false, 2),
      play(wc[0], wc[1], false, 2),
    ].sort((a, b) => a.seed - b.seed);
    return play(divW[0], divW[1], false, 3);
  }

  const afcChamp = playConference(afcSeeds);
  const nfcChamp = playConference(nfcSeeds);
  if (afcChamp && nfcChamp) {
    const champ = play(afcChamp, nfcChamp, true, 4);
    eliminations[champ.team] = 5;
  }
  return { eliminations };
}
