import { Link } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";

export const PlayerTable = ({ players }: { players: any[] }) => {
  const hasTeamColumn = players.some(player => player.teamTitle);

  return (
    <div className="space-y-3">
      {players.map((player, index) => (
        <div
          key={player.playerId || index}
          className="bg-white dark:bg-gray-800 rounded-2xl p-3 md:p-4 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue text-white rounded flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm md:text-base lg:text-lg truncate">
                  {player.playerName || player.name}
                </div>
                {hasTeamColumn && (
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {player.teamTitle || "Без команды"}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-6 lg:gap-8 flex-shrink-0">
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">
                  {player.goals}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Голов</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">
                  {player.assists}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Пасов</div>
              </div>
              <Link
                to={pathKeys.players.bySlug(String(player.playerId))}
                className="text-xs md:text-sm text-blue hover:underline whitespace-nowrap"
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
