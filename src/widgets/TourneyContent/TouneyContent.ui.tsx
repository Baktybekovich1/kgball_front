import React from "react";
import { Typography, Paper, Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";

interface Player {
  playerId: string;
  name: string;
  goals: number;
  assists: number;
  img?: string;
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
          <Typography component="div" className="col-span-2 max-md:text-base sm:col-span-3 text-lg font-bold text-white">
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
          
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-3 col-span-2 sm:col-span-3">
            {[
              { title: tournament.firstPosition.teamTitle, goals: tournament.firstPosition.goalsCount, assists: tournament.firstPosition.assistsCount },
              { title: tournament.secondPosition.teamTitle, goals: tournament.secondPosition.goalsCount, assists: tournament.secondPosition.assistsCount },
              { title: tournament.thirdPosition.teamTitle, goals: tournament.thirdPosition.goalsCount, assists: tournament.thirdPosition.assistsCount }
            ].map((team, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-2 justify-between bg-white max-md:text-xs text-black rounded-lg p-3">
                  <Typography className="max-md:text-base font-semibold">
                    {team.title}
                  </Typography>
                  <Typography className="max-md:text-base text-xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </Typography>
                </div>
                <div className="flex flex-col gap-1">
                  <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3 font-semibold">
                    Голы: {team.goals}
                  </Typography>
                  <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3 font-semibold">
                    Асситы: {team.assists}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
          <Typography className="col-span-2 max-md:text-base sm:col-span-3 text-lg font-bold text-white mt-2">
            Статистика игроков
          </Typography>
          <Typography component="div" className="bg-white max-md:text-xs text-black rounded-lg p-3">
            <strong>Бомбардиры турнира: </strong> 
            <span className="font-semibold">
             {tournament.bombardier.playerName} - {tournament.bombardier.goalsCount} голов
            </span>
          </Typography>

          <Typography component="div" className="bg-white max-md:text-xs text-black rounded-lg p-3">
            <strong>Ассистенты турнира: </strong> 
            <span className="font-semibold">
             {tournament.assistant.playerName} - {tournament.assistant.assistsCount} пасов
            </span>
          </Typography>

          <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
            Всего голов: {tournament.firstPosition.goalsCount + tournament.secondPosition.goalsCount + tournament.thirdPosition.goalsCount}
          </Typography>
          <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
            Асситы: {tournament.firstPosition.assistsCount + tournament.secondPosition.assistsCount + tournament.thirdPosition.assistsCount}
          </Typography>
        </Box>
      </div>
    );
  };

  const renderPlayersTable = (filter: (player: Player) => boolean, sortKey: "goals" | "assists") => (
    <TableContainer className="w-full" component={Paper}>
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
          {playersData
            .filter(filter)
            .sort((a, b) => b[sortKey] - a[sortKey]) // Сортировка по убыванию
            .map(player => (
              <TableRow key={player.playerId}>
                <TableCell>
                  <img className="w-12" src={player.img || DefaultAvatar} alt={player.name} />
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
          {renderPlayersTable(player => player.goals > 0, "goals")}
          </div>
      );
    case "ассистенты":
      return (
        <div className="w-full"> 
          <Typography className="mb-2" variant="h5">Ассистенты</Typography>
          {renderPlayersTable(player => player.assists > 0, "assists")}
        </div>
      );
    case "результативные":
      return (
        <div className="w-full">
          <Typography className="mb-2" variant="h5">Результативные</Typography>
          {renderPlayersTable(player => player.assists > 0 || player.goals > 0, "goals")}
          </div>
      );
    default:
      return null;
  }
};

export default TourneyContent;
