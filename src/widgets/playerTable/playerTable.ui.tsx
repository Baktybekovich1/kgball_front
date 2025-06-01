import { Link } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";

export const PlayerTable = ({ players }: { players: any[] }) => {
  const hasTeamColumn = players.some(player => player.teamTitle);

  return (
    <div className="space-y-4">
      {players.map((player, index) => (
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue text-white rounded flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-lg">
                  {player.playerName || player.name}
                </div>
                {hasTeamColumn && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {player.teamTitle || "Без команды"}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {player.goals}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Голов</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {player.assists}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Пасов</div>
              </div>
              <Link
                to={pathKeys.players.bySlug(String(player.playerId))}
                className="text-sm text-blue hover:underline"
              >
                Подробнее
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
