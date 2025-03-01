import { Link } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";
import { pathKeys } from "~shared/lib/react-router";

export const PlayerCard = ({ player }: { player: any }) => (
  <Link to={pathKeys.players.bySlug(String(player.id))} key={player.id} className="block">
    <Card className="p-3 rounded-xl shadow-lg hover:shadow-xl transition-transform hover:scale-105">
      <CardContent className="flex items-center gap-4">
        <img 
          src={player.photo || DefaultAvatar} 
          alt={player.name} 
          className="max-md:w-14 max-md:h-14 w-20 h-20 rounded-full border border-gray-400 object-cover"
        />
        
        <div className="flex flex-col">
          <Typography className="max-md:text-base text-xl font-semibold text-gray-900">
            {player.name} {player.surname}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="text-gray-600">
            <strong>Команда:</strong> {player.teamName}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="text-gray-600">
            <strong>Позиция:</strong> {player.position}
          </Typography>
        </div>
      </CardContent>
    </Card>
  </Link>
);
