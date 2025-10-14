import React, { useState, useEffect } from "react";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import { Link } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    apiClient.get("/game/all_games")
      .then(response => {
        console.log(response.data);
        if (!response.data || !Array.isArray(response.data)) {
          setError("Некорректный формат данных от сервера");
          setLoading(false);
          return;
        }

        const games = response.data.map(game => ({
          ...game,
          winnerTeamData: { id: game.winnerTeamId, title: game.winnerTeamTitle },
          loserTeamData: { id: game.loserTeamId, title: game.loserTeamTitle }
        }));

        setMatches(games);
      })
      .catch(error => {
        console.error("API Error:", error);
        setError("Ошибка загрузки списка матчей");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Box className="flex justify-center items-center h-64"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10">
      <div className="text-center mb-8">
        <Typography variant="h4" fontWeight="bold" className="text-blue-900 mb-2">
          Матчи
        </Typography>
        <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full mb-3"></div>
        <Typography variant="body2" className="text-gray-600">
          Все матчи турнира
        </Typography>
      </div>
      
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
                  {match.loserTeamData.title}
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
                      {match.loserTeamScore}
                    </Typography>
                    <Typography className="text-gray-400 text-xl font-bold">:</Typography>
                    <Typography 
                      className="text-2xl font-bold"
                      sx={{ color: '#1e40af' }}
                    >
                      {match.winnerTeamScore}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography 
                  className="font-bold text-gray-800 text-sm sm:text-base truncate flex-1 ml-2 text-right"
                  sx={{ color: '#1f2937' }}
                >
                  {match.winnerTeamData.title}
                </Typography>
              </Box>
              
              <Box className="flex justify-between items-center pt-2 border-t border-gray-200">
                <Typography className="text-xs text-gray-600">
                  🏆 Матч #{match.gameId}
                </Typography>
                <Typography className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                  Подробнее →
                </Typography>
              </Box>
            </Box>
          </Link>
        ))}
      </div>
    </Container>
  );
};
