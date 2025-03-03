import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import { Link } from "react-router-dom";

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    apiClient.get("api/games")
      .then(async (response) => {
        if (!response.data || !Array.isArray(response.data)) {
          setError("Некорректный формат данных от сервера");
          setLoading(false);
          return;
        }

        const games = response.data;
        const teamUrls = [...new Set(games.flatMap(game => [game.winnerTeam, game.loserTeam]))];
        const teamPromises = teamUrls.map(url => apiClient.get(url));
        const scorePromises = games.map(game => apiClient.get(`/game/scores/${game.id}`));

        try {
          const [teamsResponses, scoresResponses] = await Promise.all([
            Promise.all(teamPromises),
            Promise.all(scorePromises),
          ]);

          const teamMap = Object.fromEntries(
            teamsResponses.map(team => [team.data.id, team.data])
          );

          const updatedGames = games.map((game, index) => {
            const winnerTeamId = game.winnerTeam.split('/').pop();
            const loserTeamId = game.loserTeam.split('/').pop();

            return {
              ...game,
              winnerTeamData: teamMap[winnerTeamId] || {},
              loserTeamData: teamMap[loserTeamId] || {},
              scores: Array.isArray(scoresResponses[index].data) ? scoresResponses[index].data : [scoresResponses[index].data],
            };
          });

          setMatches(updatedGames);
        } catch (error) {
          console.error("Ошибка загрузки данных:", error);
          setError("Ошибка загрузки данных матчей");
        } finally {
          setLoading(false);
        }
      })
      .catch(error => {
        console.error("API Error:", error);
        setError("Ошибка загрузки списка матчей");
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10">
      <Typography variant="h5" className="font-bold mb-4">Матчи</Typography>
      <div className="grid w-full max-md:grid-cols-1 grid-cols-2 gap-4">
        {matches.map((match, index) => (
          <div className="flex-1 sm:w-[48%] md:w-[30%]" key={index}>
            <Link to={`/matches/${match.id}`} className="border p-4 rounded-md block">
              <Box className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{match.loserTeamData.title}</span>
                </div>
                <span className="text-md">{match.date}</span>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{match.winnerTeamData.title}</span>
                </div>
              </Box>
              <Box className="flex justify-between">
                <span className="text-md">
                  Счет: {match.scores.filter(score => score.loserTeamId === match.loserTeamData.id).reduce((sum, score) => sum + score.loserTeamScore, 0)} - {match.scores.filter(score => score.winnerTeamId === match.winnerTeamData.id).reduce((sum, score) => sum + score.winnerTeamScore, 0)}
                </span>
              </Box>
            </Link>
          </div>
        ))}
      </div>
    </Container>
  );
};
