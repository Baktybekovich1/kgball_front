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
      <CardContent className="flex items-center gap-5 p-4 md:p-6">
        <img
          src={player.playerImg || DefaultAvatar}
          alt={`${player.playerName} ${player.surname}`}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gray-300 object-cover shadow-sm"
        />

        <div className="flex flex-col justify-center">
          <Typography
            className="text-lg md:text-xl font-bold text-gray-800 leading-tight"
            component="div"
          >
            {player.playerName} {player.surname}
          </Typography>

          <Typography
            variant="body2"
            className="text-sm md:text-base text-gray-500 mt-1"
          >
            <span className="font-medium text-gray-600">Команда:</span> {player.teamTitle}
          </Typography>
        </div>
      </CardContent>
    </Card>
  </Link>
);
