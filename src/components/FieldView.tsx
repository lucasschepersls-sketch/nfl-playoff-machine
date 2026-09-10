import {
  type SeasonData,
  type StandingsResult,
  type SeedEntry,
  type PostseasonResult,
  winPct,
  recStr,
} from '../engine/playoff-engine';
import { BYE_WEEKS } from '../data/nfl-data';

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
  darkMode: boolean;
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
  darkMode,
}: FieldViewProps) {
  const bg = darkMode ? 'bg-gray-800' : 'bg-white';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const text = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const textSub = darkMode ? 'text-gray-300' : 'text-gray-600';
  const btnBase = darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900';
  const gameBg = darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100';
  const pickBg = darkMode ? 'bg-blue-900/40 border-blue-500' : 'bg-blue-50 border-blue-600';

  return (
    <div className="space-y-6">
      {/* Scenario Buttons */}
      <div className={`${bg} rounded-lg border ${border} p-4`}>
        <h3 className={`text-sm font-semibold mb-3 ${text}`}>Run a scenario</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyScenario('chalk')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${btnBase}`}
          >
            Chalk (Vegas favorites)
          </button>
          <button
            onClick={() => applyScenario('chaos')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${btnBase}`}
          >
            Chaos (underdogs)
          </button>
          <button
            onClick={() => applyScenario('better')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${btnBase}`}
          >
            Better record wins
          </button>
          <button
            onClick={() => applyScenario('home')}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${btnBase}`}
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
            className={`px-3 py-1.5 text-sm rounded transition-colors ${btnBase}`}
          >
            ↻ Reset picks
          </button>
        </div>
        <p className={`text-xs mt-2 ${textMuted}`}>
          Sim season rolls the dice on every unpicked game — better teams win more often. Your own picks stay locked.
        </p>
      </div>

      {/* Week Selector */}
      <div className={`${bg} rounded-lg border ${border} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-semibold ${text}`}>Pick the games</h3>
          <button
            onClick={simWeek}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${btnBase}`}
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
                  : btnBase
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
              <div key={game.id} className={`border ${border} rounded-lg p-3 transition-all hover:shadow-sm ${darkMode ? 'hover:border-gray-600' : 'hover:border-gray-300'}`}>
                <div className="flex items-center justify-between gap-2">
                  {/* Away Team */}
                  <button
                    onClick={() => onGamePick(game.id, 'a')}
                    className={`flex-1 flex items-center gap-2 p-2 rounded-lg transition-all ${
                      userPick === 'a'
                        ? pickBg + ' border-2 shadow-sm'
                        : `${gameBg} border border-transparent`
                    }`}
                  >
                    <img src={getTeamLogo(game.away)} alt={game.away} className="w-10 h-10" />
                    <div className="text-left">
                      <div className={`font-bold text-sm ${text}`}>{game.away}</div>
                      <div className={`text-xs font-mono ${textMuted}`}>{Math.round(awayWinProb * 100)}%</div>
                    </div>
                  </button>

                  <span className={`text-xs font-medium ${textMuted}`}>@</span>

                  {/* Home Team */}
                  <button
                    onClick={() => onGamePick(game.id, 'h')}
                    className={`flex-1 flex items-center gap-2 p-2 rounded-lg transition-all ${
                      userPick === 'h'
                        ? pickBg + ' border-2 shadow-sm'
                        : `${gameBg} border border-transparent`
                    }`}
                  >
                    <img src={getTeamLogo(game.home)} alt={game.home} className="w-10 h-10" />
                    <div className="text-left">
                      <div className={`font-bold text-sm ${text}`}>{game.home}</div>
                      <div className={`text-xs font-mono ${textMuted}`}>{Math.round(homeWinProb * 100)}%</div>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bye Teams */}
        {(() => {
          const byeTeams = Object.entries(BYE_WEEKS)
            .filter(([, week]) => week === currentWeek)
            .map(([team]) => team);
          
          if (byeTeams.length === 0) return null;
          
          return (
            <div className={`mt-4 p-3 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`text-xs font-semibold mb-2 ${textSub}`}>BYE this week:</div>
              <div className="flex flex-wrap gap-2">
                {byeTeams.map(team => (
                  <div key={team} className={`flex items-center gap-1.5 px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                    <img src={getTeamLogo(team)} alt={team} className="w-5 h-5" />
                    <span className={`text-xs font-medium ${text}`}>{team}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Playoff Bracket */}
      <div className={`${bg} rounded-lg border ${border} p-4`}>
        <h3 className={`text-sm font-semibold mb-4 ${text}`}>
          🏆 2026 NFL Playoff Bracket · Super Bowl, February 2027
          <span className={`text-xs ml-2 block mt-1 ${textMuted}`}>
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
            darkMode={darkMode}
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
                darkMode={darkMode}
              />
            )}
            
            {postseason.champion && (
              <div className={`border-2 border-yellow-400 rounded-lg px-6 py-4 mt-4 ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                <div className={`text-xs mb-2 text-center ${darkMode ? 'text-yellow-300' : 'text-gray-600'}`}>Projected champion</div>
                <div className="flex items-center gap-3">
                  <img src={getTeamLogo(postseason.champion)} alt={postseason.champion} className="w-12 h-12" />
                  <div className="text-left">
                    <div className={`font-bold text-lg ${text}`}>{postseason.champion}</div>
                    <div className={`text-sm ${textMuted}`}>
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
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Division Standings */}
      <div className={`${bg} rounded-lg border ${border} p-4`}>
        <h3 className={`text-sm font-semibold mb-4 ${text}`}>Division standings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['AFC', 'NFC'] as const).map(conf =>
            Object.entries(data.divisions[conf]).map(([divName, teams]) => (
              <div key={`${conf}-${divName}`}>
                <h4 className={`text-xs font-bold mb-3 uppercase tracking-wide ${textSub}`}>{conf} {divName}</h4>
                <div className="space-y-2">
                  {(teams as string[]).map((team: string) => {
                    const rec = standings.recs[team];
                    return (
                      <div key={team} className={`flex items-center gap-3 p-2 rounded transition-colors ${gameBg}`}>
                        <img src={getTeamLogo(team)} alt={team} className="w-8 h-8" />
                        <span className={`font-bold text-sm w-10 ${text}`}>{team}</span>
                        <span className={`font-mono text-sm flex-1 ${textSub}`}>{recStr(rec)}</span>
                        <span className={`text-xs font-mono ${textMuted}`}>({rec.dw}-{rec.dl})</span>
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
  darkMode,
}: {
  conf: string;
  seeds: SeedEntry[];
  games: any[];
  playoffPicks: Record<string, string>;
  onPlayoffPick: (gameId: string, team: string) => void;
  getTeamName: (t: string) => string;
  getTeamLogo: (t: string) => string;
  darkMode: boolean;
}) {
  const wildCardGames = games.filter((g: any) => g.round === 'Wild Card');
  const divisionalGames = games.filter((g: any) => g.round === 'Divisional');
  const championshipGame = games.find((g: any) => g.round === 'Championship');
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600';
  const textSub = darkMode ? 'text-gray-500' : 'text-gray-500';
  const byeBg = darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200';

  return (
    <div className="space-y-3">
      <h4 className={`text-xs font-semibold text-center uppercase tracking-wide ${textMuted}`}>{conf} · Wild Card</h4>
      <div className="space-y-2">
        {/* #1 seed bye */}
        <div className={`flex items-center gap-2 p-2 rounded border ${byeBg}`}>
          <span className={`text-xs font-bold w-5 ${textSub}`}>1</span>
          <img src={getTeamLogo(seeds[0].team)} alt={seeds[0].team} className="w-6 h-6" />
          <span className={`font-semibold text-sm flex-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{seeds[0].team}</span>
          <span className={`text-xs font-medium ${textSub}`}>BYE</span>
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
            darkMode={darkMode}
          />
        ))}
      </div>

      <h4 className={`text-xs font-semibold text-center uppercase tracking-wide mt-4 ${textMuted}`}>{conf} · Divisional</h4>
      <div className="space-y-2">
        {divisionalGames.map((game: any) => (
          <PlayoffGame
            key={game.id}
            game={game}
            playoffPicks={playoffPicks}
            onPlayoffPick={onPlayoffPick}
            getTeamName={getTeamName}
            getTeamLogo={getTeamLogo}
            darkMode={darkMode}
          />
        ))}
      </div>

      <h4 className={`text-xs font-semibold text-center uppercase tracking-wide mt-4 ${textMuted}`}>{conf} · Championship</h4>
      {championshipGame && (
        <PlayoffGame
          game={championshipGame}
          playoffPicks={playoffPicks}
          onPlayoffPick={onPlayoffPick}
          getTeamName={getTeamName}
          getTeamLogo={getTeamLogo}
          darkMode={darkMode}
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
  darkMode,
}: {
  game: any;
  playoffPicks: Record<string, string>;
  onPlayoffPick: (gameId: string, team: string) => void;
  getTeamName: (t: string) => string;
  getTeamLogo: (t: string) => string;
  darkMode: boolean;
}) {
  const userPick = playoffPicks[game.id];
  const higherWon = game.winner === game.higher.team;
  const border = darkMode ? 'border-gray-600' : 'border-gray-200';
  const borderSub = darkMode ? 'border-gray-700' : 'border-gray-100';
  const text = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const pickBg = darkMode ? 'bg-blue-900/40 border-l-4 border-l-blue-400' : 'bg-blue-50 border-l-4 border-l-blue-600';
  const winBg = darkMode ? 'bg-green-900/30' : 'bg-green-50';
  
  return (
    <div className={`border ${border} rounded-lg overflow-hidden`}>
      {/* Higher seed */}
      <button
        onClick={() => onPlayoffPick(game.id, game.higher.team)}
        className={`w-full flex items-center gap-2 p-2 transition-all border-b ${borderSub} ${
          userPick === game.higher.team
            ? pickBg
            : higherWon
            ? winBg
            : hoverBg
        }`}
      >
        <span className={`text-xs font-bold w-5 ${textMuted}`}>{game.higher.seed}</span>
        <img src={getTeamLogo(game.higher.team)} alt={game.higher.team} className="w-6 h-6" />
        <span className={`font-semibold text-sm flex-1 text-left ${text}`}>{game.higher.team}</span>
        <span className={`text-xs font-mono ${textMuted}`}>
          {Math.round(game.higherWinProb * 100)}%
        </span>
      </button>
      
      {/* Lower seed */}
      <button
        onClick={() => onPlayoffPick(game.id, game.lower.team)}
        className={`w-full flex items-center gap-2 p-2 transition-all ${
          userPick === game.lower.team
            ? pickBg
            : !higherWon
            ? winBg
            : hoverBg
        }`}
      >
        <span className={`text-xs font-bold w-5 ${textMuted}`}>{game.lower.seed}</span>
        <img src={getTeamLogo(game.lower.team)} alt={game.lower.team} className="w-6 h-6" />
        <span className={`font-semibold text-sm flex-1 text-left ${text}`}>{game.lower.team}</span>
        <span className={`text-xs font-mono ${textMuted}`}>
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
  darkMode,
}: {
  game: any;
  playoffPicks: Record<string, string>;
  onPlayoffPick: (gameId: string, team: string) => void;
  getTeamName: (t: string) => string;
  getTeamLogo: (t: string) => string;
  darkMode: boolean;
}) {
  const userPick = playoffPicks[game.id];
  const higherWon = game.winner === game.higher.team;
  const text = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const textSub = darkMode ? 'text-gray-600' : 'text-gray-600';
  const pickBg = darkMode ? 'bg-blue-900/40 border-2 border-blue-400 shadow-md' : 'bg-blue-100 border-2 border-blue-600 shadow-md';
  const winBg = darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-100 border border-green-300';
  const defaultBg = darkMode ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' : 'bg-white hover:bg-gray-50 border border-gray-200';

  return (
    <div className={`border-2 border-yellow-400 rounded-lg p-4 shadow-lg ${darkMode ? 'bg-gradient-to-b from-yellow-900/20 to-yellow-800/10' : 'bg-gradient-to-b from-yellow-50 to-yellow-100'}`}>
      <h4 className={`text-xs font-bold text-center mb-3 uppercase tracking-wider ${darkMode ? 'text-yellow-300' : 'text-gray-700'}`}>
        🏆 Super Bowl LXI
      </h4>
      <div className="space-y-2">
        <button
          onClick={() => onPlayoffPick(game.id, game.higher.team)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
            userPick === game.higher.team
              ? pickBg
              : higherWon
              ? winBg
              : defaultBg
          }`}
        >
          <span className={`text-xs font-bold w-5 ${textMuted}`}>{game.higher.seed}</span>
          <img src={getTeamLogo(game.higher.team)} alt={game.higher.team} className="w-10 h-10" />
          <span className={`font-bold text-base flex-1 text-left ${text}`}>{game.higher.team}</span>
          <span className={`text-sm font-mono font-semibold ${textSub}`}>
            {Math.round(game.higherWinProb * 100)}%
          </span>
        </button>
        <button
          onClick={() => onPlayoffPick(game.id, game.lower.team)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
            userPick === game.lower.team
              ? pickBg
              : !higherWon
              ? winBg
              : defaultBg
          }`}
        >
          <span className={`text-xs font-bold w-5 ${textMuted}`}>{game.lower.seed}</span>
          <img src={getTeamLogo(game.lower.team)} alt={game.lower.team} className="w-10 h-10" />
          <span className={`font-bold text-base flex-1 text-left ${text}`}>{game.lower.team}</span>
          <span className={`text-sm font-mono font-semibold ${textSub}`}>
            {Math.round((1 - game.higherWinProb) * 100)}%
          </span>
        </button>
      </div>
    </div>
  );
}
