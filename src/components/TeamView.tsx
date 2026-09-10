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
  runMonteCarloSim: () => void;
  onGamePick: (gameId: number, side: 'h' | 'a') => void;
  getTeamName: (t: string) => string;
  getTeamLogo: (t: string) => string;
}

export function TeamView({
  data,
  picks,
  standings,
  selectedTeam,
  setSelectedTeam,
  mcResults,
  runMonteCarloSim,
  onGamePick,
  getTeamName,
  getTeamLogo,
}: TeamViewProps) {
  const allTeams = Object.keys(standings.recs).sort();

  if (!selectedTeam) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Your team</h3>
        <p className="text-sm text-gray-600 mb-4">Choose a team above to see their path.</p>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
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

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <img src={getTeamLogo(selectedTeam)} alt={selectedTeam} className="w-16 h-16" />
          <div>
            <h2 className="text-2xl font-bold">{selectedTeam}</h2>
            <p className="text-gray-600">{getTeamName(selectedTeam)}</p>
            <p className="text-sm text-gray-500 mt-1">
              {rec.conf} {rec.div} · {recStr(rec)} · {winPct(rec).toFixed(3)}
            </p>
          </div>
        </div>

        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          {allTeams.map(team => (
            <option key={team} value={team}>{team} - {getTeamName(team)}</option>
          ))}
        </select>
      </div>

      {/* Monte Carlo Results */}
      {teamResult && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Playoff odds</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Make playoffs</div>
              <div className="text-2xl font-bold text-green-600">
                {(teamResult.makePlayoffs * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Win division</div>
              <div className="text-2xl font-bold text-blue-600">
                {(teamResult.winDivision * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">#1 seed</div>
              <div className="text-2xl font-bold text-purple-600">
                {(teamResult.topSeed * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Win Super Bowl</div>
              <div className="text-2xl font-bold text-yellow-600">
                {(teamResult.superBowl * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {!mcResults && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Run a Monte Carlo simulation to see playoff odds
          </p>
          <button
            onClick={runMonteCarloSim}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🎲 Run simulation (1000x)
          </button>
        </div>
      )}

      {/* Remaining Schedule */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-4">Their season · pick each game</h3>
        {teamGames.length === 0 ? (
          <p className="text-sm text-gray-600">No remaining games</p>
        ) : (
          <div className="space-y-3">
            {teamGames.map((game: any) => {
              const isHome = game.home === selectedTeam;
              const opponent = isHome ? game.away : game.home;
              const userPick = picks[game.id];
              
              return (
                <div key={game.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-medium">Week {game.week}</span>
                      <span className="text-sm font-semibold">
                        {isHome ? 'vs' : '@'}
                      </span>
                      <img src={getTeamLogo(opponent)} alt={opponent} className="w-8 h-8" />
                      <span className="font-bold">{opponent}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onGamePick(game.id, 'h')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          userPick === 'h'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 hover:bg-gray-200'
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
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={getTeamLogo(game.away)} alt={game.away} className="w-5 h-5" />
                          <span>{game.away}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
