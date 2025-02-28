import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Typography, Button, Box, Card, CardContent } from "@mui/material";
import { pathKeys } from "~shared/lib/react-router";
import { apiClient } from "~shared/lib/api";

import defaultTeam from "~shared/assets/img/defaultTeam.webp"
import DefaultAvatar from "~shared/assets/img/User-avatar.png"

export const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    apiClient.get("/api/teams")
      .then(response => {
        console.log("API Response:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          setError("Некорректный формат данных от сервера");
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("API Error:", error);
        setError("Ошибка загрузки списка команд");
        setLoading(false);
      });
    }, []);
    

  useEffect(() => {
    if (id) {
      apiClient.get(`/api/teams/${id}`)
        .then(response => {
          console.log("Server response:", response);
          console.log("Response data:", response.data); 
  
          if (response.data && typeof response.data === 'object') {
            const selectedTeam = response.data;
            
            Promise.all([
              ...selectedTeam.players.map((url: string) => apiClient.get(url)),
              ...selectedTeam.goals.map((url: string) => apiClient.get(url)), 
              ...selectedTeam.assists.map((url: string) => apiClient.get(url)),
            ])
            .then((responses) => {
              const players = responses.slice(0, selectedTeam.players.length);
              const goals = responses.slice(selectedTeam.players.length, selectedTeam.players.length + selectedTeam.goals.length);
              const assists = responses.slice(selectedTeam.players.length + selectedTeam.goals.length);
  
              setTeam({
                ...selectedTeam,
                players: players.map(player => player.data), 
                goals: goals.map(goal => goal.data),         
                assists: assists.map(assist => assist.data)  
              });
            })
            .catch((error) => {
              console.error("Error fetching related data:", error);
              setError("Ошибка загрузки дополнительных данных");
            });
          } else {
            setError("Неверный формат данных от сервера");
          }
        })
        .catch(error => {
          console.error("API Error:", error);
          setError("Ошибка загрузки данных команды");
        });
    }
  }, [id]);
  
    

  const [selectedTab, setSelectedTab] = useState<string>("обзор");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards"); 
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const matches = teams.length > 1 ? [
    {
      winnerTeam: "",
      loserTeam: "",
      id: 1,
      date: "2025-02-25",
      team1: teams[0],
      team2: teams[1],
      score1: 2,
      score2: 3,
    },
    {
      winnerTeam: "",
      loserTeam: "",
      id: 2,
      date: "2025-02-26",
      team1: teams[0],
      team2: teams[3],
      score1: 1,
      score2: 1,
    },
  ] : [];

  const getSortedPlayers = (players: { id: number, name: string, position: string, photo: string, goals: number, assists: number }[], category: string) => {
    let sortedPlayers = [...players];
    if (category === "scorers") {
      sortedPlayers.sort((a, b) => b.goals - a.goals);
    } else if (category === "assistants") {
      sortedPlayers.sort((a, b) => b.assists - a.assists);
    } else {
      sortedPlayers.sort((a, b) => b.goals - a.goals); 
    }
    return sortedPlayers;
  };

  const renderContent = () => {
    console.log(team);

    switch (selectedTab) {
      case "обзор":
        return team ? (
          <Box className="flex flex-col gap-5 mb-10">
            <div>
              <Typography variant="h6" fontWeight="bold">Достижения</Typography>
            </div>
            <Box className="flex gap-2">
              {team.tourneyTeamPrizes	.length > 0 ? (
                team.tourneyTeamPrizes	.map((tourneyTeamPrize, index) => (
                  <Typography
                    key={index}
                    className="max-md:text-base border border-gray-300 bg-gray-50 p-3 rounded-md text-lg text-gray-700"
                  >
                    {tourneyTeamPrize}
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
                <div>
                  <Typography variant="h6" className="font-semibold">{player.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{player.position}</Typography>
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
          <Box className="flex flex-col gap-5 mb-10">
              {matches.map(match => (
                <div className="flex-1 sm:w-[48%] md:w-[30%]">
                  <div  className="border p-4 rounded-md block">
                    <Box className="flex items-center justify-between ">
                      <div className="flex flex-col items-center">
                        <img src={match.team1.logo || defaultTeam} alt={match.team1.title} className="w-10 h-10" />
                        <span className="text-lg font-semibold">{match.team1.title}</span>
                      </div>
                      <span className="text-md">{match.date}</span>
                      <div className="flex flex-col items-center">
                        <img src={match.team2.logo || defaultTeam} alt={match.team2.title} className="w-10 h-10" />
                        <span className="text-lg font-semibold">{match.team2.title}</span>
                      </div>
                    </Box>
                    <Box className="flex justify-between">
                      <span className="text-md">Score: {match.score1}</span>
                      <span className="text-md">Score: {match.score2}</span>
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

  const renderTeamsList = () => {
    if (viewMode === "cards") {
      return (
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 p-2">
          {teams.map((team) => (
            <Link
              to={pathKeys.teams.bySlug(String(team.id))}
              key={team.id}
              className="flex flex-col items-center gap-4 p-4"
            >
              <div>
                <img src={team.logo || defaultTeam} alt={team.title} className="w-40 h-40" />
                <CardContent className="text-center">
                  <Typography variant="h6" className="font-semibold">{team.title}</Typography>
                </CardContent>
              </div>
            </Link>
          ))}
        </div>
      );
    } else {
      return (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 p-2 text-left">Команда</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-b">
                <td className="p-2">
                  <div className="flex items-center gap-6">
                    <div className="text-xl text-bold">
                      {team.id}.
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col items-center">
                        <img src={team.logo} alt={team.title} className="w-12 h-12 rounded-full" />
                        <Typography>{team.title}</Typography>
                      </div>
                      <div className="max-md:hidden">
                        <Typography>Всего матчей: {team.stats.totalMatches}</Typography>
                        <Typography>Всего голов: {team.stats.totalGoals}</Typography>
                      </div>
                    <Link
                      className="text-blue hover:underline"
                      to={pathKeys.teams.bySlug(String(team.id))}
                      key={team.id}
                      >
                        Подробнее
                    </Link>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  if (!Array.isArray(teams)) {
    return <Typography color="error">Ошибка загрузки списка команд</Typography>;
  }

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10" sx={{ padding: { xs: "16px", sm: "32px", md: "64px" } }}>
      {team ? (
        <>
          <Box className="flex flex-col items-center gap-4 mb-6">
            <img src={team.logo || defaultTeam} alt={team.title} className="w-40 h-40 rounded-full border-4 border-primary mb-4" />
            <Typography variant="h4" fontWeight="bold" align="center">{team.title}</Typography>
          </Box>

          <Box className="max-md:justify-center flex gap-4 mb-6 flex-wrap">
            <Button
              variant={selectedTab === "обзор" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("обзор")}
              fullWidth
              sx={{ maxWidth: "200px", marginBottom: { xs: "10px", sm: "0" } }}
            >
              Обзор
            </Button>
            <Button
              variant={selectedTab === "состав" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("состав")}
              fullWidth
              sx={{ maxWidth: "200px", marginBottom: { xs: "10px", sm: "0" } }}
            >
              Состав
            </Button>
            <Button
              variant={selectedTab === "матчи" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("матчи")}
              fullWidth
              sx={{ maxWidth: "200px", marginBottom: { xs: "10px", sm: "0" } }}
            >
              Матчи
            </Button>
            <Button
              variant={selectedTab === "лучшие" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("лучшие")}
              fullWidth
              sx={{ maxWidth: "200px", marginBottom: { xs: "10px", sm: "0" } }}
            >
              Лучшие
            </Button>
          </Box>
          <Box>{renderContent()}</Box>
        </>
      ) : (
        <>
          <Typography variant="h5" fontWeight="bold" mb={4}>Команды</Typography>
          <Box className="flex gap-4 mb-6">
            <Button
              variant={viewMode === "cards" ? "contained" : "outlined"}
              onClick={() => setViewMode("cards")}
            >
              Карточки
            </Button>
            <Button
              variant={viewMode === "table" ? "contained" : "outlined"}
              onClick={() => setViewMode("table")}
            >
              Таблица
            </Button>
          </Box>
          <Box>{renderTeamsList()}</Box>
        </>
      )}
    </Container>
  );
};
