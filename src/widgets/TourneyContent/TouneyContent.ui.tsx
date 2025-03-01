import React from "react";
import { Typography, Paper, Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";

interface Player {
  playerId: string;
  name: string;
  goals: number;
  assists: number;
  photo?: string;
}

interface Tournament {
  teamsCount: number;
  gamesCount: number;
  firstPosition: {
    teamTitle: string;
    goalsCount: number;
    assistsCount: number;
  };
  secondPosition: {
    teamTitle: string;
    goalsCount: number;
    assistsCount: number;
  };
  thirdPosition: {
    teamTitle: string;
    goalsCount: number;
    assistsCount: number;
  };
}

interface Props {
  selectedTab: string;
  tournament: Tournament | null;
  playersData: Player[];
}

export const TourneyContent: React.FC<Props> = ({ selectedTab, tournament, playersData }) => {
  const renderOverview = () => {
    if (!tournament) return null;
    return (
      <div className="w-full">
        <Typography variant="h6" fontWeight="bold">Обзор турнира</Typography>
        <Box className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2 p-4 bg-tundora rounded-lg shadow-lg">
          <Typography className="col-span-2 max-md:text-base sm:col-span-3 text-lg font-bold text-white">
            Турнирная статистика
          </Typography>
          <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3 font-semibold">
            Команды: {tournament.teamsCount}
          </Typography>
          <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3 font-semibold">
            Матчи: {tournament.gamesCount} 
          </Typography>
          <Typography className="col-span-2 max-md:text-base sm:col-span-3 text-lg font-bold text-white mt-2">
            Рейтинг команд
          </Typography>
          {[
            { title: tournament.firstPosition.teamTitle, goals: tournament.firstPosition.goalsCount },
            { title: tournament.secondPosition.teamTitle, goals: tournament.secondPosition.goalsCount },
            { title: tournament.thirdPosition.teamTitle, goals: tournament.thirdPosition.goalsCount }
          ].map((team, index) => (
            <div key={index} className="flex max-md:flex-col justify-between bg-white max-md:text-xs text-black rounded-lg p-3">
              <div className="flex gap-2">
                <Typography className="max-md:hidden">{index + 1}.</Typography> 
                <Typography>{team.title}</Typography>
              </div>
              <Typography className="text-bold">Голы: {team.goals}</Typography>
            </div>
          ))}
           <Typography className="col-span-2 max-md:text-base sm:col-span-3 text-lg font-bold text-white mt-2">
              Статистика игроков
            </Typography>
            <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
              Бомбардиры: {playersData.filter(player => player.goals > 0).length}
            </Typography>
            <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
              Ассистенты: {playersData.filter(player => player.assists > 0).length}
            </Typography>
            <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
              Всего голов: {tournament.firstPosition.goalsCount + tournament.secondPosition.goalsCount + tournament.thirdPosition.goalsCount}
            </Typography>
            <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
              Голевые передачи: {tournament.firstPosition.assistsCount + tournament.secondPosition.assistsCount + tournament.thirdPosition.assistsCount}
            </Typography>
            {/* <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
              Пенальти: 3
            </Typography>
            <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
              Авто голы: 2
            </Typography> */}
        </Box>
      </div>
    );
  };

  const renderPlayersTable = (filter: (player: Player) => boolean) => (
    <TableContainer className="w-full " component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Фото</TableCell>
            <TableCell>Имя</TableCell>
            <TableCell>Голы</TableCell>
            <TableCell>Голевые передачи</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playersData.filter(filter).map(player => (
            <TableRow key={player.playerId}>
              <TableCell>
                <img className="w-12" src={player.photo || DefaultAvatar} />
              </TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.goals}</TableCell>
              <TableCell>{player.assists}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  switch (selectedTab) {
    case "обзор":
      return renderOverview();
    case "бомбардиры":
      return (
        <div className="w-full">
          <Typography className="mb-2" variant="h5">Бомбардиры</Typography>
          {renderPlayersTable(player => player.goals > 0)}
        </div>
      );
    case "ассистенты":
      return (
        <div className="w-full">
          <Typography className="mb-2" variant="h5">Ассистенты</Typography>
          {renderPlayersTable(player => player.assists > 0)}
        </div>
      );
    case "результативные":
      return (
        <div className="w-full">
          <Typography className="mb-2" variant="h5">Результативные</Typography>
          {renderPlayersTable(player => player.assists > 0 || player.goals > 0)}
        </div>
      );
    default:
      return null;
  }
};

export default TourneyContent;
