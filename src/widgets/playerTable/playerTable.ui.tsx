import { Link } from "react-router-dom";
import { TableCell, TableContainer, TableRow, TableHead, Table, Paper, TableBody } from "@mui/material";
import { pathKeys } from "~shared/lib/react-router";

export const PlayerTable = ({ players }: { players: any[] }) => {
  const hasTeamColumn = players.some(player => player.teamTitle);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Имя</TableCell>
            {hasTeamColumn && <TableCell>Команда</TableCell>}
            <TableCell>Голы (Пасы)</TableCell>
            <TableCell>Действие</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player, index) => (
            <TableRow key={player.playerId}>
              <TableCell>
                <div className="flex gap-1">
                  <p className="font-bold">{index + 1}.</p>
                  {player.playerName 
                    ? `${player.playerName}`
                    : player.name}
                </div>
              </TableCell>
              {hasTeamColumn && <TableCell>{player.teamTitle || "-"}</TableCell>}
              <TableCell>{player.goals} ({player.assists})</TableCell>
              <TableCell>
                <Link to={pathKeys.players.bySlug(String(player.playerId))} className="text-blue hover:underline">
                  Подробнее
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
