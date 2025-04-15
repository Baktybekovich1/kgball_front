import React from "react";
import { Typography, Paper, Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";
import { PlayerTable } from "~widgets/playerTable";
import { Link } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";

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
  matches: any[];
  tournament: Tournament | null;
  playersData: Player[];
}

export const TourneyContent: React.FC<Props> = ({ selectedTab, matches, tournament, playersData }) => {
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

          <Typography className="bg-white max-md:text-sm text-black rounded-lg p-3">
            Всего голов: {tournament.firstPosition.goalsCount + tournament.secondPosition.goalsCount + tournament.thirdPosition.goalsCount}
          </Typography>
          <Typography className="bg-white max-md:text-sm text-black rounded-lg p-3">
            Асситы: {tournament.firstPosition.assistsCount + tournament.secondPosition.assistsCount + tournament.thirdPosition.assistsCount}
          </Typography>
        </Box>
      </div>
    );
  };

  const renderPlayersTable = (filter: (player: Player) => boolean, sortKey: "goals" | "assists") => {
    const filteredPlayers = playersData.filter(filter).sort((a, b) => b[sortKey] - a[sortKey]);
    return <PlayerTable players={filteredPlayers} />;
  };
  
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
    case "матчи":
      return (
        <div className="w-full">
        <Typography className="mb-4" variant="h5">Матчи</Typography>
        {matches.map((match, index) => (
          <div className="mb-4" key={index}>
            <Link
              to={pathKeys.matches.bySlug(String(match.gameId))}
              className="block bg-[#ddd] shadow-md hover:shadow-lg duration-300 rounded-xl p-4 border border-gray-200"
            >
              <Box className="flex items-center justify-between">
                <Typography className="font-medium text-gray-700 text-lg w-1/3">
                  {match.loserTeamTitle}
                </Typography>

                <div className="flex flex-col items-center w-1/3">
                  <div className="text-sm text-gray-500 mb-1">Счёт</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <span>{match.loserTeamGoals}</span>
                    <span className="text-red-500">:</span>
                    <span>{match.winnerTeamGoals}</span>
                  </div>
                </div>

                <Typography className="font-medium text-gray-700 text-lg text-right w-1/3">
                  {match.winnerTeamTitle}
                </Typography>
              </Box>
            </Link>
          </div>
        ))}
      </div>
      );
    default:
      return null;
  }
};

export default TourneyContent;
