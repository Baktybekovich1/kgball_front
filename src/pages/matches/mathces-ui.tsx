import React, { useState, useEffect } from "react";
import { Container, Button, Box, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "~shared/lib/api";
import { MatchContent } from "~widgets/MatchContent/MatchContent.ui"

import DefaultAvatar from "~shared/assets/img/User-avatar.png"

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);  
  const [teams, setTeams] = useState<any[]>([]);  
  const [statistics, setStatistics] = useState<any>(null); 
  const [goals, setGoals] = useState<any[]>([]);

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
  
        // Получаем данные команд по ссылкам (параллельно)
        const teamUrls = [...new Set(games.flatMap(game => [game.winnerTeam, game.loserTeam]))];
        const teamPromises = teamUrls.map(url => apiClient.get(url));
        
        // Получаем данные голов (параллельно)
        const scorePromises = games.map(game => apiClient.get(`/game/scores/${game.id}`));
  
        try {
          const [teamsResponses, scoresResponses] = await Promise.all([
            Promise.all(teamPromises),
            Promise.all(scorePromises),
          ]);
  
          // Создаём мапу команд
          const teamMap = Object.fromEntries(
            teamsResponses.map(team => [team.data.id, team.data])
          );
  
          // Обновляем игры с данными команд и голов
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
  
          // console.log("Matches:", updatedGames);
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
  

  useEffect(() => {
    if (!id) return;
  
    setLoading(true);
    setError("");
  
    const fetchMatchData = async () => {
      try {
        const matchResponse = await apiClient.get(`/api/games/${id}`);
        const match = matchResponse.data;
  
        // Запрашиваем обе команды и голы ПАРАЛЛЕЛЬНО
        const [winnerResponse, loserResponse, scoresResponse, winnerSquadResponse, loserSquadResponse, statsResponse, goalsResponse] = await Promise.all([
          apiClient.get(match.winnerTeam),
          apiClient.get(match.loserTeam),
          apiClient.get(`/game/scores/${id}`),
          apiClient.get(`/team/squad_list/${match.winnerTeam.split('/').pop()}`),
          apiClient.get(`/team/squad_list/${match.loserTeam.split('/').pop()}`),
          apiClient.get(`/team/game_statistics/${match.winnerTeam.split('/').pop()}/${match.loserTeam.split('/').pop()}`),  // New call for stats
          apiClient.get(`/game/goals/${id}`),  // Fetch goal data
        ]);
  
        setMatch({
          ...match,
          winnerTeamData: winnerResponse.data,
          loserTeamData: loserResponse.data,
        });
  
        setScores(Array.isArray(scoresResponse.data) ? scoresResponse.data : [scoresResponse.data]);
  
        setTeams({
          winner: winnerSquadResponse.data.players,
          loser: loserSquadResponse.data.players,
        });
        setStatistics(statsResponse.data); 
        console.log(goalsResponse.data);
        setGoals(goalsResponse.data);  
  
      } catch (error) {
        console.error("Ошибка загрузки данных матча:", error);
        setError("Ошибка загрузки данных матча");
      } finally {
        setLoading(false);
      }
    };
  
    fetchMatchData();
  }, [id]);
  
  const [selectedTab, setSelectedTab] = useState<string>("гол");

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10">
      {match ? (
        <>
          <div className="flex justify-between items-center border p-4 rounded-md">
            <div className="items-center">
              <img src={match.loserTeamData.logo || DefaultAvatar} alt={match.loserTeamData.title} className="w-16 h-16" />
              <h2 className="text-lg font-semibold">{match.loserTeamData.title}</h2>
              <p className="text-xl">Scores: {scores.filter(score => score.loserTeamId === match.loserTeamData.id).reduce((sum, score) => sum + score.loserTeamScore, 0)}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold">VS</p>
            </div>
            <div className="items-center">
              <img src={match.winnerTeamData.logo || DefaultAvatar} alt={match.winnerTeamData.title} className="w-16 h-16" />
              <h2 className="text-lg font-semibold">{match.winnerTeamData.title}</h2>
              <p className="text-xl">Scores: {scores.filter(score => score.winnerTeamId === match.winnerTeamData.id).reduce((sum, score) => sum + score.winnerTeamScore, 0)}</p>
            </div>
          </div>
          <Box className="flex max-md:flex-col gap-4 mb-6 mt-2">
            <Button
              variant={selectedTab === "гол" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("гол")}
              fullWidth
            >
              Гол
            </Button>
            <Button
              variant={selectedTab === "состав" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("состав")}
              fullWidth
            >
              Состав
            </Button>
            <Button
              variant={selectedTab === "статистика" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("статистика")}
              fullWidth
            >
              Статистика встреч
            </Button>
          </Box>

          <MatchContent selectedTab={selectedTab} statistics={statistics} match={match} scores={scores} teams={teams} goals={goals} />
        </>
      ) : (
        <>
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
                      Score: {match.scores.filter(score => score.loserTeamId === match.loserTeamData.id).reduce((sum, score) => sum + score.loserTeamScore, 0)} - {match.scores.filter(score => score.winnerTeamId === match.winnerTeamData.id).reduce((sum, score) => sum + score.winnerTeamScore, 0)}
                    </span>
                  </Box>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};
