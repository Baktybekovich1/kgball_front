import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import RenderContent from "~widgets/TeamContent/TeamContent.ui";
import defaultTeam from "~shared/assets/img/defaultTeam.webp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { pathKeys } from "~shared/lib/react-router";

export const TeamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("обзор");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
                tourneyTeamPrizes: tourneyTeamPrizes.map(prize => prize.data), 
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
        apiClient.get(`/team/game_list/${id}`)
        .then(response => {
          if (response.data && response.data.games && Array.isArray(response.data.games)) {
            console.log("Match: ", response.data.games);
            setMatches(response.data.games);
          } else {
            setError("Некорректный формат данных матчей");
          }
        })
        .catch(() => setError("Ошибка загрузки матчей"));
    }
  }, [id]);

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


  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10">
      {team ? (
        <>
          <Link to={pathKeys.teams.root()} className="bg-dove mb-1 p-2 rounded text-white inline-block text-blue hover:underline">
            <ArrowBackIcon /> Назад
          </Link>
          <Box className="flex flex-col items-center gap-4 mb-6">
            <img src={team.logo || defaultTeam} alt={team.title} className="w-40 h-40 rounded-full border-4 border-primary mb-4" />
            <Typography variant="h4" fontWeight="bold" align="center">{team.title}</Typography>
          </Box>
          <Box className="max-md:justify-center flex gap-4 mb-6 flex-wrap">
            {["обзор", "состав", "матчи", "лучшие"].map(tab => (
              <Button
                key={tab}
                variant={selectedTab === tab ? "contained" : "outlined"}
                onClick={() => setSelectedTab(tab)}
                fullWidth
                sx={{ maxWidth: "200px", marginBottom: { xs: "10px", sm: "0" } }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
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
        <Typography>Загрузка...</Typography>
      )}
    </Container>
  );
};
