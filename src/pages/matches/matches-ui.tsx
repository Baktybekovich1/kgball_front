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
      <Typography variant="h5" className="font-bold mb-4">Матчи</Typography>
      <div className="grid w-full max-md:grid-cols-1 grid-cols-2 gap-4">
        {matches.map((match, index) => (
          <div className="flex-1 sm:w-[48%] md:w-[30%]" key={index}>
            <Link
              to={pathKeys.matches.bySlug(String(match.gameId))}
              className="block bg-[#ddd] shadow-md hover:shadow-lg duration-300 rounded-xl p-4 border border-gray"
            >
              <Box className="flex items-center justify-between">
                <Typography className="font-medium text-gray-700 text-lg w-1/3">
                  {match.loserTeamData.title}
                </Typography>

                <div className="flex flex-col items-center w-1/3">
                  <div className="text-sm text-gray-500 mb-1">Счёт</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <span>{match.loserTeamScore}</span>
                    <span className="text-red-500">:</span>
                    <span>{match.winnerTeamScore}</span>
                  </div>
                </div>

                <Typography className="font-medium text-gray-700 text-lg text-right w-1/3">
                  {match.winnerTeamData.title}
                </Typography>
              </Box>
            </Link>
          </div>
        ))}
      </div>
    </Container>
  );
};
