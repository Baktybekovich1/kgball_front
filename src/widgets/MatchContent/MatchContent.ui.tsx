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
          <Typography variant="h6" className="max-md:text-xl text-2xl font-semibold mb-4 text-center">Голы в матче</Typography>
          {Array.isArray(scores) && scores.length > 0 ? (
            scores.map((score: any, index: number) => (
              <Box
                key={index}
                className="flex justify-between items-center p-4 rounded-2xl shadow-md bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 mb-2"
              >
                <Typography className="max-md:text-sm text-xl font-medium text-blue-900">
                  {score.loserTeamTitle} — {score.loserTeamScore}
                </Typography>
                <Typography className="max-md:text-sm text-xl font-medium text-green-800">
                  {score.winnerTeamTitle} — {score.winnerTeamScore}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">Нет данных о счете</Typography>
          )}

          <Box className="flex flex-col md:flex-row gap-6">
            {/* Левая команда */}
            <Box className="flex-1 bg-blue-50 rounded-2xl shadow-md p-4 border border-blue-100">
              <Typography className="max-md:text-sm text-xl font-semibold mb-3 text-blue-900 text-center">
                Голы: {scores?.[0]?.loserTeamTitle}
              </Typography>
              {goals.loserTeamGoals && goals.loserTeamGoals.length > 0 ? (
                goals.loserTeamGoals.map((goal: any, idx: number) => (
                  <Box key={goal.goalId} mb={3} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100 shadow-sm mb-2">
                    {/* Синий футбольный мяч */}
                    <span className="text-2xl">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#2563eb" stroke="#2563eb" strokeWidth="2"/>
                        <polygon points="12,7 15,10 13.5,15 10.5,15 9,10" fill="#fff"/>
                        <circle cx="12" cy="12" r="2" fill="#2563eb"/>
                        <circle cx="7.5" cy="10" r="1" fill="#fff"/>
                        <circle cx="16.5" cy="10" r="1" fill="#fff"/>
                        <circle cx="9" cy="16" r="1" fill="#fff"/>
                        <circle cx="15" cy="16" r="1" fill="#fff"/>
                      </svg>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-bold text-blue-900 text-lg">{goal.goalAuthor.playerName}</span>
                      <span className="text-sm text-blue-700 flex items-center gap-1">
                        {goal.assistAuthor ? (
                          <>
                            {/* Синяя бутса */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 17c0-2 2-3 4-3h7c2 0 4 1 4 3v2H3v-2Z" fill="#2563eb"/>
                              <rect x="2" y="19" width="20" height="2" rx="1" fill="#2563eb"/>
                              <path d="M7 14l2-5 6-2 2 2-2 5" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
                            </svg>
                            <span>{goal.assistAuthor.playerName}</span>
                          </>
                        ) : 'Без паса'}
                      </span>
                    </div>
                    <span className="ml-auto text-xs text-blue-400">{idx + 1}-й гол</span>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">Нет голов</Typography>
              )}
            </Box>
            {/* Правая команда */}
            <Box className="flex-1 bg-green-50 rounded-2xl shadow-md p-4 border border-green-100">
              <Typography className="max-md:text-sm text-xl font-semibold mb-3 text-green-800 text-center">
                Голы: {scores?.[0]?.winnerTeamTitle}
              </Typography>
              {goals.winnerTeamGoals && goals.winnerTeamGoals.length > 0 ? (
                goals.winnerTeamGoals.map((goal: any, idx: number) => (
                  <Box key={goal.goalId} mb={3} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100 shadow-sm mb-2">
                    {/* Синий футбольный мяч */}
                    <span className="text-2xl">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#2563eb" stroke="#2563eb" strokeWidth="2"/>
                        <polygon points="12,7 15,10 13.5,15 10.5,15 9,10" fill="#fff"/>
                        <circle cx="12" cy="12" r="2" fill="#2563eb"/>
                        <circle cx="7.5" cy="10" r="1" fill="#fff"/>
                        <circle cx="16.5" cy="10" r="1" fill="#fff"/>
                        <circle cx="9" cy="16" r="1" fill="#fff"/>
                        <circle cx="15" cy="16" r="1" fill="#fff"/>
                      </svg>
                    </span>
                    <div className="flex flex-col">
                      <span className="font-bold text-green-800 text-lg">{goal.goalAuthor.playerName}</span>
                      <span className="text-sm text-green-700 flex items-center gap-1">
                        {goal.assistAuthor ? (
                          <>
                            {/* Синяя бутса */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 17c0-2 2-3 4-3h7c2 0 4 1 4 3v2H3v-2Z" fill="#2563eb"/>
                              <rect x="2" y="19" width="20" height="2" rx="1" fill="#2563eb"/>
                              <path d="M7 14l2-5 6-2 2 2-2 5" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
                            </svg>
                            <span>{goal.assistAuthor.playerName}</span>
                          </>
                        ) : 'Без паса'}
                      </span>
                    </div>
                    <span className="ml-auto text-xs text-green-400">{idx + 1}-й гол</span>
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
        <Box className="flex flex-col md:flex-row gap-6 p-4">
          {/* Левая команда */}
          <div className="flex-1 bg-blue-50 rounded-2xl shadow p-4">
            <Typography variant="h6" className="text-center font-bold text-blue-700 mb-4">
              {match.loserTeamData.title}
            </Typography>
            <Box className="flex flex-col gap-2 mt-2">
              {teams.loser.map((player: any, idx: number) => (
                <a
                  key={player.id}
                  href={"/player/list/" + player.id}
                  className="flex items-center gap-3 py-2 px-3 bg-white rounded-lg border border-blue-100 shadow-sm hover:bg-blue-100 transition-all cursor-pointer group"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-200 text-blue-900 font-bold text-sm">{idx + 1}</span>
                  <span className="text-gray-800 text-base group-hover:underline">{player.name}</span>
                </a>
              ))}
            </Box>
          </div>
          {/* Правая команда */}
          <div className="flex-1 bg-green-50 rounded-2xl shadow p-4">
            <Typography variant="h6" className="text-center font-bold text-green-700 mb-4">
              {match.winnerTeamData.title}
            </Typography>
            <Box className="flex flex-col gap-2 mt-2">
              {teams.winner.map((player: any, idx: number) => (
                <a
                  key={player.id}
                  href={"/player/list/" + player.id}
                  className="flex items-center gap-3 py-2 px-3 bg-white rounded-lg border border-green-100 shadow-sm hover:bg-green-100 transition-all cursor-pointer group"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-200 text-green-900 font-bold text-sm">{idx + 1}</span>
                  <span className="text-gray-800 text-base group-hover:underline">{player.name}</span>
                </a>
              ))}
            </Box>
          </div>
        </Box>
      ) : null;
    case "статистика":
      return match && statistics ? (
        <Box>
          <Typography variant="h6" className="font-semibold mb-4 text-center">Статистика встречи</Typography>
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-2xl flex flex-col gap-3">
              {/* Победы */}
              <div className="grid grid-cols-3 items-center bg-blue-50 border border-blue-200 rounded-xl py-2 px-3">
                <Typography className="text-xl font-bold text-blue-800 text-center">{statistics.secondTeam.winning}</Typography>
                <Typography className="text-sm text-blue-700 font-medium text-center">Победы</Typography>
                <Typography className="text-xl font-bold text-green-700 text-center">{statistics.firstTeam.winning}</Typography>
              </div>
              {/* Голы */}
              <div className="grid grid-cols-3 items-center bg-blue-50 border border-blue-200 rounded-xl py-2 px-3">
                <Typography className="text-xl font-bold text-blue-800 text-center">{statistics.secondTeam.goals}</Typography>
                <Typography className="text-sm text-blue-700 font-medium text-center">Голы</Typography>
                <Typography className="text-xl font-bold text-green-700 text-center">{statistics.firstTeam.goals}</Typography>
              </div>
              {/* Ассисты */}
              <div className="grid grid-cols-3 items-center bg-blue-50 border border-blue-200 rounded-xl py-2 px-3">
                <Typography className="text-xl font-bold text-blue-800 text-center">{statistics.secondTeam.assists}</Typography>
                <Typography className="text-sm text-blue-700 font-medium text-center">Ассисты</Typography>
                <Typography className="text-xl font-bold text-green-700 text-center">{statistics.firstTeam.assists}</Typography>
              </div>
              {/* Бомбардир */}
              <div className="grid grid-cols-3 items-center bg-blue-50 border border-blue-200 rounded-xl py-2 px-3">
                <Typography className="text-base text-blue-700 text-center">{statistics.secondTeam.bombardier.playerName || "-"}</Typography>
                <Typography className="text-sm text-blue-700 font-medium text-center">Бомбардир</Typography>
                <Typography className="text-base text-green-700 text-center">{statistics.firstTeam.bombardier.playerName || "-"}</Typography>
              </div>
              {/* Ассистент */}
              <div className="grid grid-cols-3 items-center bg-blue-50 border border-blue-200 rounded-xl py-2 px-3">
                <Typography className="text-base text-blue-700 text-center">{statistics.secondTeam.assistant.playerName || "-"}</Typography>
                <Typography className="text-sm text-blue-700 font-medium text-center">Ассистент</Typography>
                <Typography className="text-base text-green-700 text-center">{statistics.firstTeam.assistant.playerName || "-"}</Typography>
              </div>
            </div>
          </div>
        </Box>
      ) : null;
      
    default:
      return null;
  }
};

export default MatchContent;
