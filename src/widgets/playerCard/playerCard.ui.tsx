import { Link } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";
import { pathKeys } from "~shared/lib/react-router";

export const PlayerCard = ({ player }: { player: any }) => (
  <Link
    to={pathKeys.players.bySlug(String(player.playerId))}
    key={player.playerId}
    className="block"
  >
    <Card className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200">
      <CardContent className="flex items-center gap-3 p-3 md:gap-5 md:p-6">
        <img
          src={player.playerImg || DefaultAvatar}
          alt={`${player.playerName} ${player.surname}`}
          className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-gray-300 object-cover shadow-sm flex-shrink-0"
        />

        <div className="flex flex-col justify-center min-w-0 flex-1">
          <Typography
            className="text-sm md:text-base lg:text-lg font-bold text-gray-800 leading-tight truncate"
            component="div"
          >
            {player.playerName} {player.surname}
          </Typography>

          <Typography
            variant="body2"
            className="text-xs md:text-sm text-gray-500 mt-1 truncate"
          >
            <span className="font-medium text-gray-600">Команда:</span> {player.teamTitle}
          </Typography>
        </div>
      </CardContent>
    </Card>
  </Link>
);
