import React from "react";
import { Box, Typography } from "@mui/material";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";
import { useState } from "react";
import { pathKeys } from "~shared/lib/react-router";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface RenderContentProps {
  selectedTab: string;
  team: any;
  matches: any[];
  squad: any[]; 
  bestPlayers: any[];
  prizes: any[];
}
export const RenderContent: React.FC<RenderContentProps> = ({
  selectedTab,
  team,
  matches,
  squad,
  bestPlayers,
  prizes
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
          <Box className="flex flex-col gap-2">
            {prizes &&
            (Object.keys(prizes.firstPositionPrizes || {}).length > 0 ||
              Object.keys(prizes.secondPositionPrizes || {}).length > 0 ||
              Object.keys(prizes.thirdPositionPrizes || {}).length > 0) ? (
              <Accordion className="bg-[#ddd]">
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6" fontWeight="bold">Достижения</Typography>
                </AccordionSummary>
                <AccordionDetails className="flex flex-col gap-2">
                  {Object.entries(prizes.firstPositionPrizes || {}).map(([id, title]) => (
                    <Typography
                      key={`first-${id}`}
                      className="max-md:text-base border border-gray-300 bg-white p-3 rounded-md text-lg text-gray-700"
                    >
                      🥇 Первое место — {title}
                    </Typography>
                  ))}
                  {Object.entries(prizes.secondPositionPrizes || {}).map(([id, title]) => (
                    <Typography
                      key={`second-${id}`}
                      className="max-md:text-base border border-gray-300 bg-white p-3 rounded-md text-lg text-gray-700"
                    >
                      🥈 Второе место — {title}
                    </Typography>
                  ))}
                  {Object.entries(prizes.thirdPositionPrizes || {}).map(([id, title]) => (
                    <Typography
                      key={`third-${id}`}
                      className="max-md:text-base border border-gray-300 bg-white p-3 rounded-md text-lg text-gray-700"
                    >
                      🥉 Третье место — {title}
                    </Typography>
                  ))}
                </AccordionDetails>
              </Accordion>
            ) : (
              <Typography variant="h6" fontWeight="bold">Нет Достижений</Typography>
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
            <Link 
              to={pathKeys.matches.bySlug(String(match.id))} 
              key={match.id} 
              className="hover:scale-[1.01] transition-transform duration-200"
            >
              <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
                <span className="block text-primary font-bold text-xl max-md:text-lg mb-2 text-center">
                  {match.tourney.title}
                </span>

                <Box className="flex justify-between items-center text-center">
                  <div className="flex flex-col items-center w-1/3">
                    <span className="font-semibold text-lg text-gray-800">{match.loserTeam.name}</span>
                    <span className="text-sm text-red-600">Счет: {match.loserTeam.goalTotalInGame}</span>
                  </div>

                <Box className="flex flex-col items-center justify-between mb-2 text-sm text-gray-500">
                  <span className="text-2xl font-bold text-gray-600">vs</span>
                  <span>{match.tourney.date}</span>
                </Box>

                  <div className="flex flex-col items-center w-1/3">
                    <span className="font-semibold text-lg text-gray-800">{match.winnerTeam.name}</span>
                    <span className="text-sm text-green-600">Счет: {match.winnerTeam.goalTotalInGame}</span>
                  </div>
                </Box>
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

