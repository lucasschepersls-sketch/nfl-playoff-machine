import {
  type StandingsResult,
  type PostseasonResult,
  computeDraftOrder,
  winPct,
} from '../engine/playoff-engine';

interface DraftViewProps {
  standings: StandingsResult;
  postseason: PostseasonResult;
  getTeamName: (t: string) => string;
  getTeamLogo: (t: string) => string;
  darkMode: boolean;
}

export function DraftView({
  standings,
  postseason,
  getTeamName,
  getTeamLogo,
  darkMode,
}: DraftViewProps) {
  const draftOrder = computeDraftOrder(standings, postseason.eliminations);
  const bg = darkMode ? 'bg-gray-800' : 'bg-white';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const text = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const textSub = darkMode ? 'text-gray-300' : 'text-gray-600';
  const gameBg = darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50';

  return (
    <div className={`${bg} rounded-lg border ${border} p-6`}>
      <h3 className={`text-lg font-bold mb-2 ${text}`}>2027 NFL Draft order</h3>
      <p className={`text-sm mb-6 ${textMuted}`}>
        Your picks set this too — every result moves the top of the draft.
      </p>

      <div className="space-y-1">
        {draftOrder.map((team, idx) => {
          const rec = standings.recs[team];
          const isPlayoffTeam = postseason.eliminations[team] !== undefined;
          const eliminationRound = postseason.eliminations[team];
          
          let range = '1-32';
          if (isPlayoffTeam) {
            if (eliminationRound === 1) range = '15-32';
            else if (eliminationRound === 2) range = '19-32';
            else if (eliminationRound === 3) range = '27-32';
            else if (eliminationRound === 4) range = '31-32';
            else if (eliminationRound === 5) range = '32';
          }

          return (
            <div
              key={team}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${gameBg}`}
            >
              <div className="w-10 text-center">
                <span className={`text-lg font-bold ${idx < 10 ? (darkMode ? 'text-gray-200' : 'text-gray-700') : textMuted}`}>
                  {idx + 1}
                </span>
              </div>
              <img src={getTeamLogo(team)} alt={team} className="w-10 h-10" />
              <div className="flex-1">
                <div className={`font-bold text-base ${text}`}>{team}</div>
                <div className={`text-xs ${textMuted}`}>
                  {getTeamName(team)}
                </div>
              </div>
              <div className={`text-sm font-mono ${textSub}`}>
                range {range}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
