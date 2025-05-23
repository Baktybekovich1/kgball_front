// TeamsPage.tsx
import React, { useState, useEffect } from "react";
import { Container, Typography, CircularProgress, Button, Box } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import { TeamsList } from "~widgets/TeamList/TeamList.ui";

export const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [bestTeams, setBestTeams] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");

  useEffect(() => {
    apiClient.get("/api/teams")
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          setError("Некорректный формат данных от сервера");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Ошибка загрузки списка команд");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    apiClient.get("/team/best_teams")
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setBestTeams(response.data); 
        } else {
          setError("Некорректный формат данных от сервера");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Ошибка загрузки списка команд");
        setLoading(false);
      });
  }, []);

  if (loading) return <Box className="flex justify-center items-center h-64"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  const teamsWithBestData = teams.map(team => {
    const bestTeam = bestTeams.find(best => best.id === team.id);
    if (bestTeam) {
      return {
        ...team,
        points: bestTeam.points || team.points,
        goals: Array.isArray(bestTeam.goals) ? bestTeam.goals : team.goals,  
      };
    }
    return team;
  });


  return (
    <Container className="max-w-[1440px] mb-10">
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
      <TeamsList teams={teamsWithBestData} viewMode={viewMode} />
    </Container>
  );
};
