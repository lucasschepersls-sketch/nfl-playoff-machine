import {
  type SeasonData,
  type StandingsResult,
  type SeedEntry,
  type PostseasonResult,
  winPct,
  recStr,
} from '../engine/playoff-engine';

interface FieldViewProps {
  data: SeasonData;
  picks: Record<number, string>;
  playoffPicks: Record<string, string>;
  standings: StandingsResult;
  afcSeeds: SeedEntry[];
  nfcSeeds: SeedEntry[];
  postseason: PostseasonResult;
  currentWeek: number;
  setCurrentWeek: (w: number) => void;
  weekGames: any[];
  onGamePick: (gameId: number, side: 'h' | 'a') => void;
  onPlayoffPick: (gameId: string, team: string) => void;
  applyScenario: (scenario: 'chalk' | 'chaos' | 'better' | 'home') => void;
  simWeek: () => void;
  simSeason: () => void;
  resetPicks: () => void;
  getTeamName: (t: string) => string;
  getTeamLogo: (t: string) => string;
}

export function FieldView({
  data,
  picks,
  playoffPicks,
  standings,
  afcSeeds,
  nfcSeeds,
  postseason,
  currentWeek,
  setCurrentWeek,
  weekGames,
  onGamePick,
  onPlayoffPick,
  applyScenario,
  simWeek,
  simSeason,
  resetPicks,
  getTeamName,
  getTeamLogo,
}: FieldViewProps) {
  return (
    <div className="space-y-6">
      {/* Scenario Buttons */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold mb-3">Run a scenario</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyScenario('chalk')}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Chalk (Vegas favorites)
          </button>
          <button
            onClick={() => applyScenario('chaos')}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Chaos (underdogs)
          </button>
          <button
            onClick={() => applyScenario('better')}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Better record wins
          </button>
          <button
            onClick={() => applyScenario('home')}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Home teams
          </button>
          <button
            onClick={simSeason}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
          >
            ⏩ Sim season
          </button>
          <button
            onClick={resetPicks}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            ↻ Reset picks
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Sim season rolls the dice on every unpicked game — better teams win more often. Your own picks stay locked.
        </p>
      </div>

      {/* Week Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Pick the games</h3>
          <button
            onClick={simWeek}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            🎲 Sim this week
          </button>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {Array.from({ length: 18 }, (_, i) => i + 1).map(week => (
            <button
              key={week}
              onClick={() => setCurrentWeek(week)}
              className={`px-3 py-1.5 text-sm rounded whitespace-nowrap transition-colors ${
                currentWeek === week
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Week {week}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {weekGames.map((game: any) => {
            const homeWinProb = game.wp;
            const awayWinProb = 1 - homeWinProb;
            const userPick = picks[game.id];
            
            return (
              <div key={game.id} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-all hover:shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  {/* Away Team */}
                  <button
                    onClick={() => onGamePick(game.id, 'a')}
                    className={`flex-1 flex items-center gap-2 p-2 rounded-lg transition-all ${
                      userPick === 'a'
                        ? 'bg-blue-50 border-2 border-blue-600 shadow-sm'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <img src={getTeamLogo(game.away)} alt={game.away} className="w-10 h-10" />
                    <div className="text-left">
                      <div className="font-bold text-sm">{game.away}</div>
                      <div className="text-xs text-gray-500 font-mono">{Math.round(awayWinProb * 100)}%</div>
                    </div>
                  </button>

                  <span className="text-xs text-gray-400 font-medium">@</span>

                  {/* Home Team */}
                  <button
                    onClick={() => onGamePick(game.id, 'h')}
                    className={`flex-1 flex items-center gap-2 p-2 rounded-lg transition-all ${
                      userPick === 'h'
                        ? 'bg-blue-50 border-2 border-blue-600 shadow-sm'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <img src={getTeamLogo(game.home)} alt={game.home} className="w-10 h-10" />
                    <div className="text-left">
                      <div className="font-bold text-sm">{game.home}</div>
                      <div className="text-xs text-gray-500 font-mono">{Math.round(homeWinProb * 100)}%</div>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Playoff Bracket */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold mb-4">
          🏆 2024 NFL Playoff Bracket · Super Bowl, February 2025
          <span className="text-xs text-gray-500 ml-2 block mt-1">
            Tap any team to call their game — tap again to hand it back to the model. Numbers are win odds.
          </span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AFC Bracket */}
          <BracketConference
            conf="AFC"
            seeds={afcSeeds}
            games={postseason.games.filter(g => g.conf === 'AFC')}
            playoffPicks={playoffPicks}
            onPlayoffPick={onPlayoffPick}
            getTeamName={getTeamName}
            getTeamLogo={getTeamLogo}
          />

          {/* Super Bowl */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {postseason.games.find(g => g.conf === 'SB') && (
              <SuperBowlGame
                game={postseason.games.find(g => g.conf === 'SB')!}
                playoffPicks={playoffPicks}
                onPlayoffPick={onPlayoffPick}
                getTeamName={getTeamName}
                getTeamLogo={getTeamLogo}
              />
            )}
            
            {postseason.champion && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg px-6 py-4 mt-4">
                <div className="text-xs text-gray-600 mb-2 text-center">Projected champion</div>
                <div className="flex items-center gap-3">
                  <img src={getTeamLogo(postseason.champion)} alt={postseason.champion} className="w-12 h-12" />
                  <div className="text-left">
                    <div className="font-bold text-lg">{postseason.champion}</div>
                    <div className="text-sm text-gray-600">
                      {standings.recs[postseason.champion] && 
                        `${standings.recs[postseason.champion].w}-${standings.recs[postseason.champion].l}`
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NFC Bracket */}
          <BracketConference
            conf="NFC"
            seeds={nfcSeeds}
            games={postseason.games.filter(g => g.conf === 'NFC')}
            playoffPicks={playoffPicks}
            onPlayoffPick={onPlayoffPick}
            getTeamName={getTeamName}
            getTeamLogo={getTeamLogo}
          />
        </div>
      </div>

      {/* Division Standings */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold mb-4">Division standings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['AFC', 'NFC'] as const).map(conf =>
            Object.entries(data.divisions[conf]).map(([divName, teams]) => (
              <div key={`${conf}-${divName}`}>
                <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">{conf} {divName}</h4>
                <div className="space-y-2">
                  {(teams as string[]).map((team: string) => {
                    const rec = standings.recs[team];
                    return (
                      <div key={team} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors">
                        <img src={getTeamLogo(team)} alt={team} className="w-8 h-8" />
                        <span className="font-bold text-sm w-10">{team}</span>
                        <span className="text-gray-700 font-mono text-sm flex-1">{recStr(rec)}</span>
                        <span className="text-xs text-gray-500 font-mono">({rec.dw}-{rec.dl})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BracketConference({
  conf,
  seeds,
  games,
  playoffPicks,
  onPlayoffPick,
  getTeamName,
  getTeamLogo,
}: {
  conf: string;
  seeds: SeedEntry[];
  games: any[];
  playoffPicks: Record<string, string>;
  onPlayoffPick: (gameId: string, team: string) => void;
  getTeamName: (t: string) => string;
  getTeamLogo: (t: string) => string;
}) {
  const wildCardGames = games.filter((g: any) => g.round === 'Wild Card');
  const divisionalGames = games.filter((g: any) => g.round === 'Divisional');
  const championshipGame = games.find((g: any) => g.round === 'Championship');

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wide">{conf} · Wild Card</h4>
      <div className="space-y-2">
        {/* #1 seed bye */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
          <span className="text-xs font-bold text-gray-400 w-5">1</span>
          <img src={getTeamLogo(seeds[0].team)} alt={seeds[0].team} className="w-6 h-6" />
          <span className="font-semibold text-sm flex-1">{seeds[0].team}</span>
          <span className="text-xs text-gray-500 font-medium">BYE</span>
        </div>
        
        {/* Wild Card games */}
        {wildCardGames.map((game: any) => (
          <PlayoffGame
            key={game.id}
            game={game}
            playoffPicks={playoffPicks}
            onPlayoffPick={onPlayoffPick}
            getTeamName={getTeamName}
            getTeamLogo={getTeamLogo}
          />
        ))}
      </div>

      <h4 className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wide mt-4">{conf} · Divisional</h4>
      <div className="space-y-2">
        {divisionalGames.map((game: any) => (
          <PlayoffGame
            key={game.id}
            game={game}
            playoffPicks={playoffPicks}
            onPlayoffPick={onPlayoffPick}
            getTeamName={getTeamName}
            getTeamLogo={getTeamLogo}
          />
        ))}
      </div>

      <h4 className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wide mt-4">{conf} · Championship</h4>
      {championshipGame && (
        <PlayoffGame
          game={championshipGame}
          playoffPicks={playoffPicks}
          onPlayoffPick={onPlayoffPick}
          getTeamName={getTeamName}
          getTeamLogo={getTeamLogo}
        />
      )}
    </div>
  );
}

function PlayoffGame({
  game,
  playoffPicks,
  onPlayoffPick,
  getTeamName,
  getTeamLogo,
}: {
  game: any;
  playoffPicks: Record<string, string>;
  onPlayoffPick: (gameId: string, team: string) => void;
  getTeamName: (t: string) => string;
  getTeamLogo: (t: string) => string;
}) {
  const userPick = playoffPicks[game.id];
  const higherWon = game.winner === game.higher.team;
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Higher seed */}
      <button
        onClick={() => onPlayoffPick(game.id, game.higher.team)}
        className={`w-full flex items-center gap-2 p-2 transition-all border-b border-gray-100 ${
          userPick === game.higher.team
            ? 'bg-blue-50 border-l-4 border-l-blue-600'
            : higherWon
            ? 'bg-green-50'
            : 'hover:bg-gray-50'
        }`}
      >
        <span className="text-xs font-bold text-gray-400 w-5">{game.higher.seed}</span>
        <img src={getTeamLogo(game.higher.team)} alt={game.higher.team} className="w-6 h-6" />
        <span className="font-semibold text-sm flex-1 text-left">{game.higher.team}</span>
        <span className="text-xs text-gray-500 font-mono">
          {Math.round(game.higherWinProb * 100)}%
        </span>
      </button>
      
      {/* Lower seed */}
      <button
        onClick={() => onPlayoffPick(game.id, game.lower.team)}
        className={`w-full flex items-center gap-2 p-2 transition-all ${
          userPick === game.lower.team
            ? 'bg-blue-50 border-l-4 border-l-blue-600'
            : !higherWon
            ? 'bg-green-50'
            : 'hover:bg-gray-50'
        }`}
      >
        <span className="text-xs font-bold text-gray-400 w-5">{game.lower.seed}</span>
        <img src={getTeamLogo(game.lower.team)} alt={game.lower.team} className="w-6 h-6" />
        <span className="font-semibold text-sm flex-1 text-left">{game.lower.team}</span>
        <span className="text-xs text-gray-500 font-mono">
          {Math.round((1 - game.higherWinProb) * 100)}%
        </span>
      </button>
    </div>
  );
}

function SuperBowlGame({
  game,
  playoffPicks,
  onPlayoffPick,
  getTeamName,
  getTeamLogo,
}: {
  game: any;
  playoffPicks: Record<string, string>;
  onPlayoffPick: (gameId: string, team: string) => void;
  getTeamName: (t: string) => string;
  getTeamLogo: (t: string) => string;
}) {
  const userPick = playoffPicks[game.id];
  const higherWon = game.winner === game.higher.team;

  return (
    <div className="border-2 border-yellow-400 rounded-lg p-4 bg-gradient-to-b from-yellow-50 to-yellow-100 shadow-lg">
      <h4 className="text-xs font-bold text-gray-700 text-center mb-3 uppercase tracking-wider">
        🏆 Super Bowl LIX
      </h4>
      <div className="space-y-2">
        <button
          onClick={() => onPlayoffPick(game.id, game.higher.team)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
            userPick === game.higher.team
              ? 'bg-blue-100 border-2 border-blue-600 shadow-md'
              : higherWon
              ? 'bg-green-100 border border-green-300'
              : 'bg-white hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <span className="text-xs font-bold text-gray-400 w-5">{game.higher.seed}</span>
          <img src={getTeamLogo(game.higher.team)} alt={game.higher.team} className="w-10 h-10" />
          <span className="font-bold text-base flex-1 text-left">{game.higher.team}</span>
          <span className="text-sm text-gray-600 font-mono font-semibold">
            {Math.round(game.higherWinProb * 100)}%
          </span>
        </button>
        <button
          onClick={() => onPlayoffPick(game.id, game.lower.team)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
            userPick === game.lower.team
              ? 'bg-blue-100 border-2 border-blue-600 shadow-md'
              : !higherWon
              ? 'bg-green-100 border border-green-300'
              : 'bg-white hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <span className="text-xs font-bold text-gray-400 w-5">{game.lower.seed}</span>
          <img src={getTeamLogo(game.lower.team)} alt={game.lower.team} className="w-10 h-10" />
          <span className="font-bold text-base flex-1 text-left">{game.lower.team}</span>
          <span className="text-sm text-gray-600 font-mono font-semibold">
            {Math.round((1 - game.higherWinProb) * 100)}%
          </span>
        </button>
      </div>
    </div>
  );
}
