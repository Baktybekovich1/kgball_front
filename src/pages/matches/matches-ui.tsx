import React, { useState, useEffect } from "react";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import { Link } from "react-router-dom";

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
      <Typography variant="h5" className="font-bold mb-4">Матчи</Typography>
      <div className="grid w-full max-md:grid-cols-1 grid-cols-2 gap-4">
        {matches.map((match, index) => (
          <div className="flex-1 sm:w-[48%] md:w-[30%]" key={index}>
            <Link to={`/matches/${match.gameId}`} className="border p-4 bg-alto rounded-md block">
              <Box className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{match.loserTeamData.title}</span>
                </div>
                <span className="text-md font-semibold">VS</span>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{match.winnerTeamData.title}</span>
                </div>
              </Box>
              <Box className="flex justify-between">
                <span className="text-md">
                  Счет: {match.loserTeamScore} - {match.winnerTeamScore}
                </span>
              </Box>
            </Link>
          </div>
        ))}
      </div>
    </Container>
  );
};
