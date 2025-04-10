import React from "react";
import { Box, Typography } from "@mui/material";

interface MatchContentProps {
  selectedTab: string;
  match: any;
  scores: any[];
  statistics: any[];
  teams: any;
  goals: any[]; 
}

export const MatchContent: React.FC<MatchContentProps> = ({ selectedTab, match, scores, teams, statistics, goals }) => {
  switch (selectedTab) { 
    case "гол":
      return match ? (
        <Box className="space-y-6">
          <Typography variant="h6" className="max-md:text-xl text-2xl font-semibold mb-4">Счет</Typography>

          {Array.isArray(scores) && scores.length > 0 ? (
            scores.map((score: any, index: number) => (
              <Box
                key={index}
                className="flex justify-between items-center p-4 rounded-2xl shadow-md bg-[#ddd]"
              >
                <Typography className="max-md:text-sm text-xl font-medium">
                  {score.loserTeamTitle} — {score.loserTeamScore}
                </Typography>
                <Typography className="max-md:text-sm text-xl font-medium">
                  {score.winnerTeamTitle} — {score.winnerTeamScore}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">Нет данных о счете</Typography>
          )}

          <Box className="flex flex-col md:flex-row gap-6">
            <Box className="flex-1 p-4 rounded-2xl shadow-md bg-[#ddd] dark:bg-neutral-800">
              <Typography className="max-md:text-sm text-xl font-semibold mb-3">
                Голы: {scores?.[0]?.loserTeamTitle}
              </Typography>
              {goals.loserTeamGoals && goals.loserTeamGoals.length > 0 ? (
                goals.loserTeamGoals.map((goal: any) => (
                  <Box key={goal.goalId} mb={3}>
                    <Typography className="max-md:text-sm text-lg">
                      ⚽ {goal.goalAuthor.playerName}
                    </Typography>
                    <Typography className="max-md:text-sm text-base text-gray-500">
                      {goal.assistAuthor ? `🅰️ ${goal.assistAuthor.playerName}` : 'Без паса'}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">Нет голов</Typography>
              )}
            </Box>

            <Box className="flex-1 p-4 rounded-2xl shadow-md bg-[#ddd] dark:bg-neutral-800">
              <Typography className="max-md:text-sm text-xl font-semibold mb-3">
                Голы: {scores?.[0]?.winnerTeamTitle}
              </Typography>
              {goals.winnerTeamGoals && goals.winnerTeamGoals.length > 0 ? (
                goals.winnerTeamGoals.map((goal: any) => (
                  <Box key={goal.goalId} mb={3}>
                    <Typography className="max-md:text-sm text-lg">
                      ⚽ {goal.goalAuthor.playerName}
                    </Typography>
                    <Typography className="max-md:text-sm text-base text-gray-500">
                      {goal.assistAuthor ? `🅰️ ${goal.assistAuthor.playerName}` : 'Без паса'}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">Нет голов</Typography>
              )}
            </Box>
          </Box>
        </Box>
      ) : null;
    case "состав":
      return match ? (
        <Box className="flex justify-between max-md:p-0 p-4">
          <div className="flex flex-col w-1/2 max-md:p-0 p-4">
            <Typography variant="h6" className="text-center max-md:text-md font-bold text-blue-600 mb-2">
              {match.loserTeamData.title}
            </Typography>
            <Box className="flex flex-col gap-2 mt-2">
              {teams.loser.map((player: any) => (
                <Box key={player.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-200 transition-all">
                  <Typography className="max-md:text-sm text-gray-800">{player.name}</Typography>
                </Box>
              ))}
            </Box>
          </div>
          <div className="flex flex-col w-1/2 max-md:p-0 p-4">
            <Typography variant="h6" className="text-center max-md:text-md font-bold text-green-600 mb-2">
              {match.winnerTeamData.title}
            </Typography>
            <Box className="flex flex-col gap-2 mt-2">
              {teams.winner.map((player: any) => (
                <Box key={player.id} className="flexjustify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-200 transition-all">
                  <Typography className="max-md:text-sm text-gray-800 text-right">{player.name}</Typography>
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
