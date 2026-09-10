import {
  type SeasonData,
  type StandingsResult,
  type MonteCarloResult,
  winPct,
  recStr,
} from '../engine/playoff-engine';

interface TeamViewProps {
  data: SeasonData;
  picks: Record<number, string>;
  standings: StandingsResult;
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
  mcResults: Record<string, MonteCarloResult> | null;
  mcRunning?: boolean;
  runMonteCarloSim: () => void;
  onGamePick: (gameId: number, side: 'h' | 'a') => void;
  getTeamName: (t: string) => string;
  getTeamLogo: (t: string) => string;
  darkMode: boolean;
}

export function TeamView({
  data,
  picks,
  standings,
  selectedTeam,
  setSelectedTeam,
  mcResults,
  mcRunning,
  runMonteCarloSim,
  onGamePick,
  getTeamName,
  getTeamLogo,
  darkMode,
}: TeamViewProps) {
  const allTeams = Object.keys(standings.recs).sort();
  const bg = darkMode ? 'bg-gray-800' : 'bg-white';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const text = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const textSub = darkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900';
  const gameBg = darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100';

  if (!selectedTeam) {
    return (
      <div className={`${bg} rounded-lg border ${border} p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${text}`}>Your team</h3>
        <p className={`text-sm mb-4 ${textMuted}`}>Choose a team above to see their path.</p>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm ${inputBg}`}
        >
          <option value="">Pick a team…</option>
          {allTeams.map(team => (
            <option key={team} value={team}>{team} - {getTeamName(team)}</option>
          ))}
        </select>
      </div>
    );
  }

  const rec = standings.recs[selectedTeam];
  const flatGames = data._flat || [];
  const teamGames = flatGames.filter((g: any) => 
    (g.home === selectedTeam || g.away === selectedTeam) && !g.done
  );

  const teamResult = mcResults?.[selectedTeam];
  const pickBg = darkMode ? 'bg-blue-900/40 text-blue-200' : 'bg-blue-600 text-white shadow-sm';
  const btnBase = darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700';
  
  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className={`${bg} rounded-lg border ${border} p-6`}>
        <div className="flex items-center gap-4 mb-4">
          <img src={getTeamLogo(selectedTeam)} alt={selectedTeam} className="w-16 h-16" />
          <div>
            <h2 className={`text-2xl font-bold ${text}`}>{selectedTeam}</h2>
            <p className={textSub}>{getTeamName(selectedTeam)}</p>
            <p className={`text-sm mt-1 ${textMuted}`}>
              {rec.conf} {rec.div} · {recStr(rec)} · {winPct(rec).toFixed(3)}
            </p>
          </div>
        </div>

        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm ${inputBg}`}
        >
          {allTeams.map(team => (
            <option key={team} value={team}>{team} - {getTeamName(team)}</option>
          ))}
        </select>
      </div>

      {/* Monte Carlo Results */}
      {teamResult && (
        <div className={`${bg} rounded-lg border ${border} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${text}`}>Playoff odds</h3>
            {mcRunning && (
              <span className={`text-xs ${textMuted} animate-pulse`}>⏳ Updating...</span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className={`text-xs mb-1 ${textMuted}`}>Make playoffs</div>
              <div className="text-2xl font-bold text-green-500">
                {(teamResult.makePlayoffs * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className={`text-xs mb-1 ${textMuted}`}>Win division</div>
              <div className="text-2xl font-bold text-blue-500">
                {(teamResult.winDivision * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className={`text-xs mb-1 ${textMuted}`}>#1 seed</div>
              <div className="text-2xl font-bold text-purple-500">
                {(teamResult.topSeed * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className={`text-xs mb-1 ${textMuted}`}>Win Super Bowl</div>
              <div className="text-2xl font-bold text-yellow-500">
                {(teamResult.superBowl * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {!mcResults && !mcRunning && (
        <div className={`${bg} rounded-lg border ${border} p-6 text-center`}>
          <p className={`text-sm mb-4 ${textMuted}`}>
            Calculating playoff odds...
          </p>
        </div>
      )}

      {/* Remaining Schedule */}
      <div className={`${bg} rounded-lg border ${border} p-6`}>
        <h3 className={`text-lg font-bold mb-4 ${text}`}>Their season · pick each game</h3>
        {teamGames.length === 0 ? (
          <p className={`text-sm ${textMuted}`}>No remaining games</p>
        ) : (
          <div className="space-y-3">
            {teamGames.map((game: any) => {
              const isHome = game.home === selectedTeam;
              const opponent = isHome ? game.away : game.home;
              const userPick = picks[game.id];
              
              return (
                <div key={game.id} className={`border ${border} rounded-lg p-4 transition-colors ${darkMode ? 'hover:border-gray-600' : 'hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium ${textMuted}`}>Week {game.week}</span>
                      <span className={`text-sm font-semibold ${text}`}>
                        {isHome ? 'vs' : '@'}
                      </span>
                      <img src={getTeamLogo(opponent)} alt={opponent} className="w-8 h-8" />
                      <span className={`font-bold ${text}`}>{opponent}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onGamePick(game.id, 'h')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          userPick === 'h'
                            ? pickBg
                            : btnBase
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={getTeamLogo(game.home)} alt={game.home} className="w-5 h-5" />
                          <span>{game.home}</span>
                        </div>
                      </button>
                      <button
                        onClick={() => onGamePick(game.id, 'a')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          userPick === 'a'
                            ? pickBg
                            : btnBase
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={getTeamLogo(game.away)} alt={game.away} className="w-5 h-5" />
                          <span>{game.away}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
