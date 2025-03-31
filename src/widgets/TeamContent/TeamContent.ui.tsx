import React from "react";
import { Box, Typography } from "@mui/material";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";
import { useState } from "react";
import { pathKeys } from "~shared/lib/react-router";
import { Link } from "react-router-dom";

interface RenderContentProps {
  selectedTab: string;
  team: any;
  matches: any[];
  squad: any[]; 
  bestPlayers: any[];
}
export const RenderContent: React.FC<RenderContentProps> = ({
  selectedTab,
  team,
  matches,
  squad,
  bestPlayers
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const getSortedPlayers = (category: string) => {
    const players = bestPlayers.map(player => ({
      ...player,
      goals: Number(player.goals) || 0,
      assists: Number(player.assists) || 0,
    }));
  
    return players.sort((a, b) => {
      if (category === "assistants") {
        if (b.assists !== a.assists) return b.assists - a.assists;
        return b.goals - a.goals;
      }
  
      if (category === "scorers") {
        if (b.goals !== a.goals) return b.goals - a.goals;
        return b.assists - a.assists;
      }
  
      return (b.goals + b.assists) - (a.goals + a.assists);
    });
  };
  
  switch (selectedTab) {
    case "обзор":
      return team ? (
        <Box className="flex flex-col gap-5 mb-10">
          <div>
            <Typography variant="h6" fontWeight="bold">Достижения</Typography>
          </div>
          <Box className="flex gap-2">
            {team.tourneyTeamPrizes.length > 0 ? (
              team.tourneyTeamPrizes.map((prize, index) => (
                <Typography
                  key={index}
                  className="max-md:text-base border border-gray-300 bg-gray-50 p-3 rounded-md text-lg text-gray-700"
                >
                  {prize.firstPosition ? "Первое мессто - 🥇" : prize.secondPosition ? "Второе место - 🥈" : "Третье место - 🥉"}
                </Typography>
              ))
            ) : (
              <Typography className="text-lg text-gray-700">Нет достижений</Typography>
            )}
          </Box>
          <div>
            <Typography variant="h6" fontWeight="bold">Матчи</Typography>
          </div>
          <div className="grid grid-cols-2 gap-4 p-2">
            <Typography 
              className="max-md:text-base border border-gray-300 bg-gray-50 p-3 rounded-md text-lg text-gray-700"
            >
              Всего сыграно матчей: <span className="font-semibold">{matches.length}</span>
            </Typography>
            <Typography 
              className="max-md:text-base border border-gray-300 bg-gray-50 p-3 rounded-md text-lg text-gray-700"
            >
              Всего голов: <span className="font-semibold">{team.goals.length}</span>
            </Typography>
            <Typography 
              className="max-md:text-base border border-gray-300 bg-gray-50 p-3 rounded-md text-lg text-gray-700"
            >
              Передачи: <span className="font-semibold">{team.assists.length}</span>
            </Typography>
          </div>
        </Box>
      ) : null;
      
      case "состав":
        return squad && squad.length > 0 ? (
          <Box className="flex flex-col gap-5 mb-10">
              <Typography variant="h6" fontWeight="bold">Состав команды</Typography>
              {squad.map(player => (
                <Link to={pathKeys.players.bySlug(String(player.id))} key={player.id}>
                  <Box key={player.id} className="flex items-center gap-4 p-4 border border-gray-300 rounded-md">
                    <img src={player.img || DefaultAvatar} alt={player.name} className="w-12 h-12 rounded-full" />
                    <div className="flex w-full justify-between items-center">
                      <div>
                        <Typography variant="h6" className="font-semibold">{player.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{player.teamTitle}</Typography>
                      </div>
                      <Typography variant="body2" className="text-base">
                        {player.position}
                      </Typography>
                    </div> 
                  </Box>
                </Link>
              ))}
            </Box>
        ) : (
          <Typography className="text-lg text-gray-700">Нет игроков в составе</Typography>
        );
    case "матчи":
      return matches ? (
        <Box className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
          {matches.map((match, index) => (
            <Link to={pathKeys.matches.bySlug(String(match.id))}>
              <div>
                <span className="max-md:text-md font-semibold text-xl">{match.tourney.title}</span> 
                <div className="border p-4 rounded-md block">
                  <Box className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-semibold">{match.loserTeam.name}</span>
                    </div>
                    <span className="text-md">{match.tourney.date}</span>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-semibold">{match.winnerTeam.name}</span>
                    </div>
                  </Box>
                  <Box className="flex justify-between">
                    <span className="text-md">Счет: {match.loserTeam.goalTotalInGame}</span>
                    <span className="text-md">Счет: {match.winnerTeam.goalTotalInGame}</span>
                  </Box>
                </div>
              </div>
            </Link>
          ))}
        </Box>

      ) : null;
    case "лучшие":
      return team ? (
        <Box className="flex flex-col gap-5 mb-10">
          <Typography variant="h6" fontWeight="bold">Лучшие игроки</Typography>
          
          <Box className="mb-4">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)} 
              className="border p-2 rounded-md"
            >
              <option value="all">Все игроки</option>
              <option value="scorers">Бомбардиры</option>
              <option value="assistants">Ассистенты</option>
            </select>
          </Box>
          <Box className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {getSortedPlayers(selectedCategory).map((player) => (
              <Link to={pathKeys.players.bySlug(String(player.playerId))} key={player.playerId}>
                <Box key={player.id} className="flex items-center gap-4 p-4 border border-gray-300 rounded-md">
                  <img src={player.img || DefaultAvatar} alt={player.name} className="w-12 h-12 rounded-full" />
                  <div className="flex  w-full justify-between items-center">
                    <div>
                      <Typography variant="h6" className="font-semibold">{player.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{player.position}</Typography>
                    </div>
                    <Typography variant="body2" className="text-base">
                      {player.goals} + ({player.assists}) = {player.goals + player.assists}
                    </Typography>
                  </div>
                </Box>
              </Link>
            ))}
          </Box>
        </Box>
      ) : null;
    default:
      return null;
  }
};

export default RenderContent;

