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
          <Typography variant="h5" className="mb-6 text-center font-bold text-gray-800">
            Матчи турнира
          </Typography>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {matches.map((match, index) => (
              <Link
                key={index}
                to={pathKeys.matches.bySlug(String(match.gameId))}
                className="block group"
                style={{ textDecoration: 'none' }}
              >
                <Box 
                  sx={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    borderRadius: 3,
                    p: 3,
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                      borderColor: '#3b82f6',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                    }
                  }}
                >
                  <Box className="flex items-center justify-between mb-3">
                    <Typography 
                      className="font-bold text-gray-800 text-sm sm:text-base truncate flex-1 mr-2"
                      sx={{ color: '#1f2937' }}
                    >
                      {match.loserTeamTitle}
                    </Typography>
                    
                    <Box className="flex flex-col items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <Typography className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                        Счёт
                      </Typography>
                      <Box className="flex items-center gap-1">
                        <Typography 
                          className="text-2xl font-bold"
                          sx={{ color: '#1e40af' }}
                        >
                          {match.loserTeamGoals}
                        </Typography>
                        <Typography className="text-gray-400 text-xl font-bold">:</Typography>
                        <Typography 
                          className="text-2xl font-bold"
                          sx={{ color: '#1e40af' }}
                        >
                          {match.winnerTeamGoals}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography 
                      className="font-bold text-gray-800 text-sm sm:text-base truncate flex-1 ml-2 text-right"
                      sx={{ color: '#1f2937' }}
                    >
                      {match.winnerTeamTitle}
                    </Typography>
                  </Box>
                  
                  <Box className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <Typography className="text-xs text-gray-600">
                      📅 {match.date ? new Date(match.date).toLocaleDateString('ru-RU') : 'Дата не указана'}
                    </Typography>
                    <Typography className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                      Игра #{match.gameId}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default TourneyContent;
