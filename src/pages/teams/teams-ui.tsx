import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Typography, Button, Box, Card, CardContent } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import { TeamsList } from "~widgets/TeamList/TeamList.ui"
import RenderContent from "~widgets/TeamContent/TeamContent.ui";  

import defaultTeam from "~shared/assets/img/defaultTeam.webp"

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
                ...selectedTeam.tourneyTeamPrizes.map((url: string) => apiClient.get(url)), // Загружаем призы
              ])
              .then((responses) => {
                const players = responses.slice(0, selectedTeam.players.length);
                const goals = responses.slice(selectedTeam.players.length, selectedTeam.players.length + selectedTeam.goals.length);
                const assists = responses.slice(selectedTeam.players.length + selectedTeam.goals.length, selectedTeam.players.length + selectedTeam.goals.length + selectedTeam.assists.length);
                const tourneyTeamPrizes = responses.slice(selectedTeam.players.length + selectedTeam.goals.length + selectedTeam.assists.length);
    
                setTeam({
                  ...selectedTeam,
                  players: players.map(player => player.data), 
                  goals: goals.map(goal => goal.data),         
                  assists: assists.map(assist => assist.data),
                  tourneyTeamPrizes: tourneyTeamPrizes.map(prize => prize.data), // Обновляем призы
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
          <RenderContent 
            selectedTab={selectedTab} 
            team={team} 
            selectedCategory={selectedCategory} 
            matches={matches} 
            getSortedPlayers={getSortedPlayers} 
          />
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
          <TeamsList teams={teams} viewMode={viewMode} />  
        </>
      )}
    </Container>
  );
};


