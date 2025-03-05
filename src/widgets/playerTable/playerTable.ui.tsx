import { Link } from "react-router-dom";
import { TableCell, TableContainer, TableRow, TableHead, Table, Paper, TableBody } from "@mui/material";
import { pathKeys } from "~shared/lib/react-router";
export const PlayerTable = ({ players }: { players: any[] }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Имя</TableCell>
          <TableCell>Команда</TableCell>
          <TableCell>Голы(Пасы)</TableCell>
          <TableCell>Действие</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {players.map(player => (
          <TableRow key={player.playerId}>
            <TableCell>{player.playerName} {player.surname}</TableCell>
            <TableCell>{player.teamTitle}</TableCell>
            <TableCell>{player.goals}({player.assists})</TableCell>
            <TableCell>
              <Link to={pathKeys.players.bySlug(String(player.playerId))} className="text-blue hover:underline">Подробнее</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
