import React from "react";
import { Box, Typography } from "@mui/material";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";

interface RenderContentProps {
  selectedTab: string;
  team: any;
  selectedCategory: string;
  matches: any[];
  getSortedPlayers: (players: any[], category: string) => any[];
}

export const RenderContent: React.FC<RenderContentProps> = ({
  selectedTab,
  team,
  selectedCategory,
  matches,
  getSortedPlayers,
}) => {
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
              Всего сыграно матчей: <span className="font-semibold"></span>
            </Typography>
            <Typography 
              className="max-md:text-base border border-gray-300 bg-gray-50 p-3 rounded-md text-lg text-gray-700"
            >
              Всего голов: <span className="font-semibold">{team.goals.length}</span>
            </Typography>
            <Typography 
              className="max-md:text-base border border-gray-300 bg-gray-50 p-3 rounded-md text-lg text-gray-700"
            >
              Штрафные: <span className="font-semibold"></span>
            </Typography>
            <Typography 
              className="max-md:text-base border border-gray-300 bg-gray-50 p-3 rounded-md text-lg text-gray-700"
            >
              Передачи: <span className="font-semibold">{team.assists.length}</span>
            </Typography>
            <Typography 
              className="max-md:text-base border border-gray-300 bg-gray-50 p-3 rounded-md text-lg text-gray-700"
            >
              Автоголы: <span className="font-semibold"></span>
            </Typography>
          </div>
        </Box>
      ) : null;
      case "состав":
        return team ? (
          <Box className="flex flex-col gap-5 mb-10">
            <Typography variant="h6" fontWeight="bold">Состав команды</Typography>
            {team.players && team.players.length > 0 ? (
              team.players.map(player => (
                <Box key={player.id} className="flex items-center gap-4 p-4 border border-gray-300 rounded-md">
                  <img src={player.photo || DefaultAvatar} alt={player.name} className="w-12 h-12 rounded-full" />
                  <div className="flex w-full justify-between items-center">
                    <div>
                      <Typography variant="h6" className="font-semibold">{player.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{player.position}</Typography>
                    </div>
                    <Typography variant="body2" className="text-base">
                      {player.goals.length} + {player.assists.length}
                    </Typography>
                  </div>
                </Box>
              ))
            ) : (
              <Typography className="text-lg text-gray-700">Нет игроков в составе</Typography>
            )}
          </Box>
        ) : null;
      
    case "матчи":
      return matches ? (
        <Box className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
          {matches.map((match, index) => (
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
            {getSortedPlayers(team.players, selectedCategory).map((player) => (
              <Box key={player.id} className="flex items-center gap-4 p-4 border border-gray-300 rounded-md">
                <img src={player.photo || DefaultAvatar} alt={player.name} className="w-12 h-12 rounded-full" />
                <div className="flex  w-full justify-between items-center">
                  <div>
                    <Typography variant="h6" className="font-semibold">{player.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{player.position}</Typography>
                  </div>
                  <Typography variant="body2" className="text-base">
                    {player.goals.length} + ({player.assists.length}) = {player.goals.length + player.assists.length}
                  </Typography>
                </div>
              </Box>
            ))}
          </Box>
        </Box>
      ) : null;
    default:
      return null;
  }
};

export default RenderContent;
