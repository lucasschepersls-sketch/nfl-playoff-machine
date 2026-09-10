import { useState, useMemo, useCallback } from 'react';
import {
  computeStandings,
  seedConference,
  resolvePostseason,
  runMonteCarlo,
  winPct,
  recStr,
  type SeasonData,
  type StandingsResult,
  type SeedEntry,
  type PostseasonResult,
  type MonteCarloResult,
} from './engine/playoff-engine';
import { createSeasonData, TEAM_NAMES, TEAM_COLORS } from './data/nfl-data';
import { FieldView } from './components/FieldView';
import { TeamView } from './components/TeamView';
import { DraftView } from './components/DraftView';

const TEAM_LOGOS: Record<string, string> = {
  BUF: 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
  MIA: 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png',
  NE: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png',
  NYJ: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',
  BAL: 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
  CIN: 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png',
  CLE: 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png',
  PIT: 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png',
  HOU: 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png',
  IND: 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png',
  JAX: 'https://a.espncdn.com/i/teamlogos/nfl/500/jax.png',
  TEN: 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png',
  DEN: 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png',
  KC: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
  LV: 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png',
  LAC: 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png',
  DAL: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
  NYG: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
  PHI: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
  WAS: 'https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png',
  CHI: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
  DET: 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png',
  GB: 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',
  MIN: 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png',
  ATL: 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png',
  CAR: 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png',
  NO: 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png',
  TB: 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png',
  ARI: 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
  LAR: 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png',
  SF: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
  SEA: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
};

type TabType = 'field' | 'team' | 'draft';

function App() {
  const [data] = useState<SeasonData>(() => createSeasonData());
  const [picks, setPicks] = useState<Record<number, string>>({});
  const [playoffPicks, setPlayoffPicks] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<TabType>('field');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [mcResults, setMcResults] = useState<Record<string, MonteCarloResult> | null>(null);

  const standings = useMemo<StandingsResult>(() => computeStandings(data, picks), [data, picks]);
  const afcSeeds = useMemo<SeedEntry[]>(() => seedConference(standings, data, 'AFC'), [standings, data]);
  const nfcSeeds = useMemo<SeedEntry[]>(() => seedConference(standings, data, 'NFC'), [standings, data]);
  const postseason = useMemo<PostseasonResult>(() =>
    resolvePostseason(afcSeeds, nfcSeeds, playoffPicks, data.ratings || {}),
    [afcSeeds, nfcSeeds, playoffPicks, data.ratings]
  );

  const handleGamePick = useCallback((gameId: number, side: 'h' | 'a') => {
    setPicks(prev => ({ ...prev, [gameId]: side }));
  }, []);

  const handlePlayoffPick = useCallback((gameId: string, team: string) => {
    setPlayoffPicks(prev => {
      const newPicks = { ...prev };
      if (newPicks[gameId] === team) {
        delete newPicks[gameId];
      } else {
        newPicks[gameId] = team;
      }
      return newPicks;
    });
  }, []);

  const applyScenario = useCallback((scenario: 'chalk' | 'chaos' | 'better' | 'home') => {
    const newPicks = { ...picks };
    const flatGames = data._flat || [];
    
    flatGames.forEach(g => {
      if (g.done || newPicks[g.id]) return;
      
      switch (scenario) {
        case 'chalk':
          newPicks[g.id] = g.wp >= 0.5 ? 'h' : 'a';
          break;
        case 'chaos':
          newPicks[g.id] = g.wp >= 0.5 ? 'a' : 'h';
          break;
        case 'better': {
          const ratings = data.ratings || {};
          const homeRating = ratings[g.home] || 0;
          const awayRating = ratings[g.away] || 0;
          newPicks[g.id] = homeRating >= awayRating ? 'h' : 'a';
          break;
        }
        case 'home':
          newPicks[g.id] = 'h';
          break;
      }
    });
    
    setPicks(newPicks);
  }, [data, picks]);

  const simWeek = useCallback(() => {
    const newPicks = { ...picks };
    const flatGames = data._flat || [];
    
    flatGames.forEach(g => {
      if (g.done || g.week !== currentWeek || newPicks[g.id]) return;
      newPicks[g.id] = Math.random() < g.wp ? 'h' : 'a';
    });
    
    setPicks(newPicks);
  }, [data, picks, currentWeek]);

  const simSeason = useCallback(() => {
    const newPicks = { ...picks };
    const flatGames = data._flat || [];
    
    flatGames.forEach(g => {
      if (g.done || newPicks[g.id]) return;
      newPicks[g.id] = Math.random() < g.wp ? 'h' : 'a';
    });
    
    setPicks(newPicks);
  }, [data, picks]);

  const resetPicks = useCallback(() => {
    setPicks({});
    setPlayoffPicks({});
  }, []);

  const runMonteCarloSim = useCallback(() => {
    const results = runMonteCarlo(data, picks, 1000);
    setMcResults(results);
  }, [data, picks]);

  const getTeamName = (team: string) => TEAM_NAMES[team] || team;
  const getTeamLogo = (team: string) => TEAM_LOGOS[team] || '';

  const weekGames = useMemo(() => {
    const flatGames = data._flat || [];
    return flatGames.filter(g => g.week === currentWeek);
  }, [data, currentWeek]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">NFL Playoff Predictor</h1>
              <p className="text-xs text-gray-500">The Playoff Machine · Week {currentWeek}, 2026 season</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('field')}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'field'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              The field
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'team'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Your team
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'draft'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Draft order
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'field' && (
          <FieldView
            data={data}
            picks={picks}
            playoffPicks={playoffPicks}
            standings={standings}
            afcSeeds={afcSeeds}
            nfcSeeds={nfcSeeds}
            postseason={postseason}
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
            weekGames={weekGames}
            onGamePick={handleGamePick}
            onPlayoffPick={handlePlayoffPick}
            applyScenario={applyScenario}
            simWeek={simWeek}
            simSeason={simSeason}
            resetPicks={resetPicks}
            getTeamName={getTeamName}
            getTeamLogo={getTeamLogo}
          />
        )}
        {activeTab === 'team' && (
          <TeamView
            data={data}
            picks={picks}
            standings={standings}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            mcResults={mcResults}
            runMonteCarloSim={runMonteCarloSim}
            onGamePick={handleGamePick}
            getTeamName={getTeamName}
            getTeamLogo={getTeamLogo}
          />
        )}
        {activeTab === 'draft' && (
          <DraftView
            standings={standings}
            postseason={postseason}
            getTeamName={getTeamName}
            getTeamLogo={getTeamLogo}
          />
        )}
      </main>
    </div>
  );
}

export default App;
