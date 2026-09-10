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

type TabType = 'standings' | 'seeds' | 'bracket' | 'odds';

function App() {
  const [data] = useState<SeasonData>(() => createSeasonData());
  const [activeTab, setActiveTab] = useState<TabType>('standings');
  const [selectedConf, setSelectedConf] = useState<'AFC' | 'NFC'>('AFC');
  const [mcResults, setMcResults] = useState<Record<string, MonteCarloResult> | null>(null);
  const [mcRunning, setMcRunning] = useState(false);

  const standings = useMemo<StandingsResult>(() => computeStandings(data), [data]);

  const afcSeeds = useMemo<SeedEntry[]>(() => seedConference(standings, data, 'AFC'), [standings, data]);
  const nfcSeeds = useMemo<SeedEntry[]>(() => seedConference(standings, data, 'NFC'), [standings, data]);

  const postseason = useMemo<PostseasonResult>(() =>
    resolvePostseason(afcSeeds, nfcSeeds, {}, data.ratings || {}),
    [afcSeeds, nfcSeeds, data.ratings]
  );

  const runSimulation = useCallback(() => {
    setMcRunning(true);
    setTimeout(() => {
      const results = runMonteCarlo(data, {}, 1000);
      setMcResults(results);
      setMcRunning(false);
    }, 100);
  }, [data]);

  const getTeamColor = (team: string) => TEAM_COLORS[team] || { primary: '#333', secondary: '#666' };
  const getTeamName = (team: string) => TEAM_NAMES[team] || team;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                🏈
              </div>
              <div>
                <h1 className="text-xl font-bold">NFL Playoff Machine</h1>
                <p className="text-xs text-gray-400">2024 Season • Week 18 Complete</p>
              </div>
            </div>
            <button
              onClick={runSimulation}
              disabled={mcRunning}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
              {mcRunning ? '⏳ Simulando...' : '🎲 Simular Temporada (1000x)'}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex gap-1 bg-gray-800/50 rounded-xl p-1">
          {([
            { id: 'standings', label: '📊 Classificação', icon: '' },
            { id: 'seeds', label: '🏆 Seeds', icon: '' },
            { id: 'bracket', label: '🎯 Bracket', icon: '' },
            { id: 'odds', label: '📈 Probabilidades', icon: '' },
          ] as { id: TabType; label: string; icon: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Quick Summary Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-800/60 rounded-lg border border-gray-700 p-3 text-center">
            <div className="text-xs text-gray-400">Campeão Previsto</div>
            <div className="text-lg font-bold text-yellow-400">{postseason.champion || '-'}</div>
          </div>
          <div className="bg-gray-800/60 rounded-lg border border-gray-700 p-3 text-center">
            <div className="text-xs text-gray-400">AFC #1 Seed</div>
            <div className="text-lg font-bold text-red-400">{afcSeeds[0]?.team || '-'}</div>
          </div>
          <div className="bg-gray-800/60 rounded-lg border border-gray-700 p-3 text-center">
            <div className="text-xs text-gray-400">NFC #1 Seed</div>
            <div className="text-lg font-bold text-blue-400">{nfcSeeds[0]?.team || '-'}</div>
          </div>
          <div className="bg-gray-800/60 rounded-lg border border-gray-700 p-3 text-center">
            <div className="text-xs text-gray-400">Super Bowl</div>
            <div className="text-lg font-bold">
              <span className="text-red-400">{postseason.games.find(g => g.conf === 'SB')?.higher.team || '-'}</span>
              {' vs '}
              <span className="text-blue-400">{postseason.games.find(g => g.conf === 'SB')?.lower.team || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'standings' && (
          <StandingsView
            standings={standings}
            data={data}
            selectedConf={selectedConf}
            setSelectedConf={setSelectedConf}
            getTeamName={getTeamName}
            getTeamColor={getTeamColor}
          />
        )}
        {activeTab === 'seeds' && (
          <SeedsView
            afcSeeds={afcSeeds}
            nfcSeeds={nfcSeeds}
            getTeamName={getTeamName}
            getTeamColor={getTeamColor}
          />
        )}
        {activeTab === 'bracket' && (
          <BracketView
            postseason={postseason}
            getTeamName={getTeamName}
            getTeamColor={getTeamColor}
          />
        )}
        {activeTab === 'odds' && (
          <OddsView
            mcResults={mcResults}
            mcRunning={mcRunning}
            runSimulation={runSimulation}
            getTeamName={getTeamName}
            getTeamColor={getTeamColor}
            data={data}
          />
        )}
      </main>
    </div>
  );
}

// Standings View
function StandingsView({
  standings,
  data,
  selectedConf,
  setSelectedConf,
  getTeamName,
  getTeamColor,
}: {
  standings: StandingsResult;
  data: SeasonData;
  selectedConf: 'AFC' | 'NFC';
  setSelectedConf: (c: 'AFC' | 'NFC') => void;
  getTeamName: (t: string) => string;
  getTeamColor: (t: string) => { primary: string; secondary: string };
}) {
  const conf = selectedConf;
  const divs = data.divisions[conf];

  return (
    <div>
      {/* Conference Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedConf('AFC')}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${
            selectedConf === 'AFC'
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          AFC
        </button>
        <button
          onClick={() => setSelectedConf('NFC')}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${
            selectedConf === 'NFC'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          NFC
        </button>
      </div>

      {/* Division Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(divs).map(([divName, teams]) => (
          <div key={divName} className="bg-gray-800/60 rounded-xl border border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 px-4 py-2 border-b border-gray-700">
              <h3 className="font-bold text-sm text-gray-300">{conf} {divName}</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-700/50">
                  <th className="text-left px-3 py-2">#</th>
                  <th className="text-left px-3 py-2">Time</th>
                  <th className="text-center px-3 py-2">W-L</th>
                  <th className="text-center px-3 py-2">PCT</th>
                  <th className="text-center px-3 py-2">DIV</th>
                  <th className="text-center px-3 py-2">CONF</th>
                </tr>
              </thead>
              <tbody>
                {teams
                  .map((t) => standings.recs[t])
                  .sort((a, b) => winPct(b) - winPct(a))
                  .map((rec, idx) => {
                    const colors = getTeamColor(rec.team);
                    return (
                      <tr
                        key={rec.team}
                        className={`border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors ${
                          idx === 0 ? 'bg-green-900/20' : ''
                        }`}
                      >
                        <td className="px-3 py-2 text-gray-500 text-sm">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: colors.primary }}
                            />
                            <span className="font-medium text-sm">{rec.team}</span>
                            <span className="text-xs text-gray-500 hidden sm:inline">{getTeamName(rec.team)}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center text-sm font-mono">{recStr(rec)}</td>
                        <td className="px-3 py-2 text-center text-sm font-mono text-gray-300">
                          {winPct(rec).toFixed(3)}
                        </td>
                        <td className="px-3 py-2 text-center text-sm font-mono text-gray-400">
                          {rec.dw}-{rec.dl}{rec.dt > 0 ? `-${rec.dt}` : ''}
                        </td>
                        <td className="px-3 py-2 text-center text-sm font-mono text-gray-400">
                          {rec.cw}-{rec.cl}{rec.ct > 0 ? `-${rec.ct}` : ''}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

// Seeds View
function SeedsView({
  afcSeeds,
  nfcSeeds,
  getTeamName,
  getTeamColor,
}: {
  afcSeeds: SeedEntry[];
  nfcSeeds: SeedEntry[];
  getTeamName: (t: string) => string;
  getTeamColor: (t: string) => { primary: string; secondary: string };
}) {
  const renderSeeds = (seeds: SeedEntry[], conf: string) => (
    <div className="bg-gray-800/60 rounded-xl border border-gray-700 overflow-hidden">
      <div className={`px-4 py-3 border-b border-gray-700 ${
        conf === 'AFC' ? 'bg-red-900/30' : 'bg-blue-900/30'
      }`}>
        <h3 className="font-bold">{conf} Playoff Seeds</h3>
      </div>
      <div className="divide-y divide-gray-700/50">
        {seeds.map((seed) => {
          const colors = getTeamColor(seed.team);
          return (
            <div
              key={seed.team}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-700/30 transition-colors ${
                seed.seed === 1 ? 'bg-yellow-900/20' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                seed.seed === 1
                  ? 'bg-yellow-500 text-black'
                  : seed.seed <= 4
                  ? 'bg-green-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}>
                {seed.seed}
              </div>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{seed.team}</span>
                  <span className="text-xs text-gray-400">{getTeamName(seed.team)}</span>
                  {seed.isDivisionWinner && (
                    <span className="text-[10px] bg-green-600/30 text-green-400 px-1.5 py-0.5 rounded">
                      DIV
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {recStr(seed.rec)} • {winPct(seed.rec).toFixed(3)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderSeeds(afcSeeds, 'AFC')}
      {renderSeeds(nfcSeeds, 'NFC')}
    </div>
  );
}

// Bracket View
function BracketView({
  postseason,
  getTeamName,
  getTeamColor,
}: {
  postseason: PostseasonResult;
  getTeamName: (t: string) => string;
  getTeamColor: (t: string) => { primary: string; secondary: string };
}) {
  const afcGames = postseason.games.filter((g) => g.conf === 'AFC');
  const nfcGames = postseason.games.filter((g) => g.conf === 'NFC');
  const sbGames = postseason.games.filter((g) => g.conf === 'SB');

  const renderGame = (game: typeof postseason.games[0]) => {
    const higherColors = getTeamColor(game.higher.team);
    const lowerColors = getTeamColor(game.lower.team);
    const higherWon = game.winner === game.higher.team;

    return (
      <div className="bg-gray-800/80 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-3 py-1.5 bg-gray-700/50 text-xs text-gray-400 flex justify-between">
          <span>{game.round}</span>
          <span>#{game.higher.seed} vs #{game.lower.seed}</span>
        </div>
        <div className="p-2 space-y-1">
          <div className={`flex items-center gap-2 px-2 py-1 rounded ${higherWon ? 'bg-green-900/30' : ''}`}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: higherColors.primary }} />
            <span className={`text-sm flex-1 ${higherWon ? 'font-bold text-green-400' : 'text-gray-400'}`}>
              #{game.higher.seed} {game.higher.team}
            </span>
            {higherWon && <span className="text-green-400 text-xs">✓</span>}
          </div>
          <div className={`flex items-center gap-2 px-2 py-1 rounded ${!higherWon ? 'bg-green-900/30' : ''}`}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lowerColors.primary }} />
            <span className={`text-sm flex-1 ${!higherWon ? 'font-bold text-green-400' : 'text-gray-400'}`}>
              #{game.lower.seed} {game.lower.team}
            </span>
            {!higherWon && <span className="text-green-400 text-xs">✓</span>}
          </div>
        </div>
      </div>
    );
  };

  const renderConferenceBracket = (games: typeof postseason.games, conf: string) => {
    const wc = games.filter((g) => g.round === 'Wild Card');
    const div = games.filter((g) => g.round === 'Divisional');
    const champ = games.filter((g) => g.round === 'Championship');

    return (
      <div className="bg-gray-800/40 rounded-xl border border-gray-700 p-4">
        <h3 className={`font-bold text-center mb-4 ${conf === 'AFC' ? 'text-red-400' : 'text-blue-400'}`}>
          {conf} Bracket
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-2 text-center">Wild Card</p>
            <div className="space-y-2">
              {wc.map((g) => renderGame(g))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2 text-center">Divisional</p>
            <div className="space-y-2">
              {div.map((g) => renderGame(g))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2 text-center">Conference Championship</p>
            {champ.map((g) => renderGame(g))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderConferenceBracket(afcGames, 'AFC')}
        {renderConferenceBracket(nfcGames, 'NFC')}
      </div>

      {/* Super Bowl */}
      {sbGames.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-900/30 via-gray-800/60 to-yellow-900/30 rounded-xl border border-yellow-600/30 p-6">
          <h3 className="font-bold text-center text-yellow-400 text-lg mb-4">🏆 Super Bowl LIX</h3>
          {sbGames.map((g) => {
            const higherColors = getTeamColor(g.higher.team);
            const lowerColors = getTeamColor(g.lower.team);
            const higherWon = g.winner === g.higher.team;
            return (
              <div key={g.id} className="max-w-md mx-auto">
                <div className="flex items-center justify-between gap-4">
                  <div className={`flex-1 text-center p-4 rounded-lg ${higherWon ? 'bg-yellow-600/20 border border-yellow-500/30' : 'bg-gray-700/50'}`}>
                    <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: higherColors.primary }} />
                    <div className={`font-bold ${higherWon ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {g.higher.team}
                    </div>
                    <div className="text-xs text-gray-500">{getTeamName(g.higher.team)}</div>
                    <div className="text-xs text-gray-500">{g.higher.rec.conf} #{g.higher.seed}</div>
                    {higherWon && <div className="text-yellow-400 text-sm mt-1">🏆 Champion</div>}
                  </div>
                  <div className="text-2xl font-bold text-gray-500">VS</div>
                  <div className={`flex-1 text-center p-4 rounded-lg ${!higherWon ? 'bg-yellow-600/20 border border-yellow-500/30' : 'bg-gray-700/50'}`}>
                    <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: lowerColors.primary }} />
                    <div className={`font-bold ${!higherWon ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {g.lower.team}
                    </div>
                    <div className="text-xs text-gray-500">{getTeamName(g.lower.team)}</div>
                    <div className="text-xs text-gray-500">{g.lower.rec.conf} #{g.lower.seed}</div>
                    {!higherWon && <div className="text-yellow-400 text-sm mt-1">🏆 Champion</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Odds View
function OddsView({
  mcResults,
  mcRunning,
  runSimulation,
  getTeamName,
  getTeamColor,
  data,
}: {
  mcResults: Record<string, MonteCarloResult> | null;
  mcRunning: boolean;
  runSimulation: () => void;
  getTeamName: (t: string) => string;
  getTeamColor: (t: string) => { primary: string; secondary: string };
  data: SeasonData;
}) {
  if (!mcResults) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎲</div>
        <h2 className="text-2xl font-bold mb-2">Simulação Monte Carlo</h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Execute 1.000 simulações da temporada para calcular as probabilidades de cada time
          fazer os playoffs, vencer a divisão, e ganhar o Super Bowl.
        </p>
        <button
          onClick={runSimulation}
          disabled={mcRunning}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-bold text-lg transition-all disabled:opacity-50 shadow-lg shadow-green-500/20"
        >
          {mcRunning ? '⏳ Simulando...' : '▶️ Iniciar Simulação'}
        </button>
      </div>
    );
  }

  // Sort teams by playoff probability
  const sortedTeams = Object.entries(mcResults)
    .sort(([, a], [, b]) => b.makePlayoffs - a.makePlayoffs);

  const formatPct = (v: number) => `${(v * 100).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Probabilidades (1.000 simulações)</h2>
        <button
          onClick={runSimulation}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-all"
        >
          🔄 Re-simular
        </button>
      </div>

      {/* Top Contenders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Playoff Odds */}
        <div className="bg-gray-800/60 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-green-900/30 to-gray-800/50 border-b border-gray-700">
            <h3 className="font-bold text-green-400">🏈 Chance de Playoff</h3>
          </div>
          <div className="divide-y divide-gray-700/30 max-h-96 overflow-y-auto">
            {sortedTeams.map(([team, result]) => {
              const colors = getTeamColor(team);
              const pct = result.makePlayoffs;
              return (
                <div key={team} className="px-4 py-2 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
                  <span className="font-mono text-sm w-8">{team}</span>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct * 100}%`,
                          backgroundColor: pct >= 0.9 ? '#22c55e' : pct >= 0.5 ? '#eab308' : '#ef4444',
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-mono w-14 text-right">{formatPct(pct)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Super Bowl Odds */}
        <div className="bg-gray-800/60 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-yellow-900/30 to-gray-800/50 border-b border-gray-700">
            <h3 className="font-bold text-yellow-400">🏆 Chance de Super Bowl</h3>
          </div>
          <div className="divide-y divide-gray-700/30 max-h-96 overflow-y-auto">
            {sortedTeams
              .sort(([, a], [, b]) => b.superBowl - a.superBowl)
              .map(([team, result]) => {
                const colors = getTeamColor(team);
                const pct = result.superBowl;
                return (
                  <div key={team} className="px-4 py-2 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
                    <span className="font-mono text-sm w-8">{team}</span>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full transition-all"
                          style={{ width: `${Math.max(pct * 100 * 3, pct > 0 ? 2 : 0)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-mono w-14 text-right">{formatPct(pct)}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Division Odds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['AFC', 'NFC'] as const).map((conf) => (
          <div key={conf} className="bg-gray-800/60 rounded-xl border border-gray-700 overflow-hidden">
            <div className={`px-4 py-3 border-b border-gray-700 ${
              conf === 'AFC' ? 'bg-red-900/20' : 'bg-blue-900/20'
            }`}>
              <h3 className="font-bold">{conf} - Chance de Divisão</h3>
            </div>
            <div className="divide-y divide-gray-700/30">
              {Object.entries(data.divisions[conf]).map(([divName, teams]) => (
                <div key={divName} className="px-4 py-2">
                  <p className="text-xs text-gray-500 mb-1">{divName}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {teams.map((team) => {
                      const result = mcResults[team];
                      const colors = getTeamColor(team);
                      return (
                        <div key={team} className="text-center">
                          <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ backgroundColor: colors.primary }} />
                          <div className="text-xs font-mono">{team}</div>
                          <div className="text-xs text-green-400">{formatPct(result.winDivision)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Seed Distribution */}
      <div className="bg-gray-800/60 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-purple-900/30 to-gray-800/50 border-b border-gray-700">
          <h3 className="font-bold text-purple-400">📊 Distribuição de Seeds (Top 8)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-3 py-2">Time</th>
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <th key={s} className="text-center px-2 py-2 text-xs text-gray-400">#{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedTeams.slice(0, 12).map(([team, result]) => {
                const colors = getTeamColor(team);
                return (
                  <tr key={team} className="border-b border-gray-700/30">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
                        <span className="font-mono">{team}</span>
                      </div>
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                      <td key={s} className="text-center px-2 py-2 font-mono text-xs">
                        {result.seedDist[s] ? formatPct(result.seedDist[s]) : '-'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
