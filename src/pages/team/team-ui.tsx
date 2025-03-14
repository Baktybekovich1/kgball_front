import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Typography, CircularProgress, Button, Box } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import RenderContent from "~widgets/TeamContent/TeamContent.ui";
import defaultTeam from "~shared/assets/img/defaultTeam.webp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { pathKeys } from "~shared/lib/react-router";

export const TeamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [bestPlayers, setBestPlayers] = useState([]);
  const [squad, setSquad] = useState([]);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("обзор");

  useEffect(() => {
    if (id) {
      apiClient.get(`/api/teams/${id}`)
        .then(response => {
          if (response.data && typeof response.data === 'object') {
            setTeam(response.data);
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
          if (response.data?.games && Array.isArray(response.data.games)) {
            setMatches(response.data.games);
          } else {
            setError("Некорректный формат данных матчей");
          }
        })
        .catch(() => setError("Ошибка загрузки матчей"));

      apiClient.get(`/team/best_players/${id}`)
        .then(response => {
          if (response.data?.players && Array.isArray(response.data.players)) {
            console.log(response.data.players);
            setBestPlayers(response.data.players);
          } else {
            setError("Некорректный формат данных лучших игроков");
          }
        })
        .catch(() => setError("Ошибка загрузки лучших игроков"));

      apiClient.get(`/team/squad_list/${id}`)
        .then(response => {
          if (response.data?.players && Array.isArray(response.data.players)) {
            setSquad(response.data.players);  
          } else {
            setError("Некорректный формат данных состава команды");
          }
        })
        .catch(() => setError("Ошибка загрузки состава команды"));
    }
  }, [id]);


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
            matches={matches} 
            bestPlayers={bestPlayers}
            squad={squad} 
          />
        </>
      ) : (
        <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>
      )}
    </Container>
  );
};
