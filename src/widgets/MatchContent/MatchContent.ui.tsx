import React from "react";
import { Box, Typography } from "@mui/material";

interface MatchContentProps {
  selectedTab: string;
  match: any;
  goals: any[];
  statistics: any[];
  teams: any;
}

export const MatchContent: React.FC<MatchContentProps> = ({ selectedTab, match, goals, teams, statistics }) => {
  switch (selectedTab) { 
    case "гол":
      return match ? (
        <Box>
          <Typography variant="h6">Голы:</Typography>
          {Array.isArray(goals) && goals.length > 0 ? (
            goals.map((goal: any, index: number) => (
              <Box className="flex justify-between" key={index} mb={2}>
                <Typography className="max-md:text-xl text-[25px]">
                  {goal.loserTeamTitle} - {goal.loserTeamScore}
                </Typography>
                <Typography className="max-md:text-xl text-[25px]">
                  {goal.winnerTeamTitle} - {goal.winnerTeamScore}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No goals available</Typography>
          )}
        </Box>
      ) : null;
    case "состав":
      return match ? (
        <Box className="flex justify-between">
          <div className="flex flex-col">
            <Typography variant="h6" >{match.loserTeamData.title}</Typography>
            <Box className="flex flex-col gap-2 mt-4">
              {teams.loser.map((player: any) => (
                <Box key={player.id} className="flex justify-between items-center">
                  <Typography>{player.name}</Typography>
                </Box>
              ))}
            </Box>
          </div>

          <div className="flex flex-col">
            <Typography variant="h6" >{match.winnerTeamData.title}</Typography>
            <Box className="flex flex-col gap-2 mt-4" >
              {teams.winner.map((player: any) => (
                <Box key={player.id} className="flex justify-between items-center">
                  <Typography>{player.name}</Typography>
                </Box>
              ))}
            </Box>
          </div>
        </Box>
      ) : null;
    case "статистика":
      return match && statistics ? (
        <Box >
          <Typography variant="h6" className="font-semibold">Статистика встречи</Typography>     
          <div className="flex max-md:flex-col justify-between">
            <Box className="mt-4">
              <Typography className="font-semibold" variant="h6">{match.loserTeamData.title}:</Typography>
              <Typography>Победы: {statistics.secondTeam.winning}</Typography>
              <Typography>Голы: {statistics.secondTeam.goals}</Typography>
              <Typography>Ассисты: {statistics.secondTeam.assists}</Typography>
              <Typography>
                Бомбардир: {statistics.secondTeam.bombardier.playerName || "Не определён"}
              </Typography>
              <Typography>
                Ассистент: {statistics.secondTeam.assistant.playerName || "Не определён"}
              </Typography>
            </Box>
            <Box className="mt-4">
              <Typography className="font-semibold" variant="h6">{match.winnerTeamData.title}:</Typography>
              <Typography>Победы: {statistics.firstTeam.winning}</Typography>
              <Typography>Голы: {statistics.firstTeam.goals}</Typography>
              <Typography>Ассисты: {statistics.firstTeam.assists}</Typography>
              <Typography>
                Бомбардир: {statistics.firstTeam.bombardier.playerName || "Не определён"}
              </Typography>
              <Typography>
                Ассистент: {statistics.firstTeam.assistant.playerName || "Не определён"}
              </Typography>
            </Box>
          </div>     
        </Box>
      ) : null;
      
    default:
      return null;
  }
};

export default MatchContent;
