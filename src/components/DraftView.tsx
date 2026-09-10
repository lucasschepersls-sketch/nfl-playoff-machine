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
}

export function DraftView({
  standings,
  postseason,
  getTeamName,
  getTeamLogo,
}: DraftViewProps) {
  const draftOrder = computeDraftOrder(standings, postseason.eliminations);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold mb-2">2027 NFL Draft order</h3>
      <p className="text-sm text-gray-600 mb-6">
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
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                idx < 10
                  ? 'hover:bg-gray-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-10 text-center">
                <span className={`text-lg font-bold ${idx < 10 ? 'text-gray-700' : 'text-gray-400'}`}>
                  {idx + 1}
                </span>
              </div>
              <img src={getTeamLogo(team)} alt={team} className="w-10 h-10" />
              <div className="flex-1">
                <div className="font-bold text-base">{team}</div>
                <div className="text-xs text-gray-500">
                  {getTeamName(team)}
                </div>
              </div>
              <div className="text-sm text-gray-600 font-mono">
                range {range}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
