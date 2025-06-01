import React, { useState, useEffect } from "react";
import { Container, Paper, CircularProgress, Typography, Box } from "@mui/material";
import { pathKeys } from "~shared/lib/react-router";
import { Link } from "react-router-dom";
import { apiClient } from "~shared/lib/api";

export const TournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.get("api/tourneys")
      .then(response => {
        console.log("API Response:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setTournaments(response.data);
        } else {
          setError("Некорректный формат данных от сервера");
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("API Error:", error);
        setError("Ошибка загрузки списка турниров");
        setLoading(false);
      });
  }, []);

  if (loading) return <Box className="flex justify-center items-center h-64"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10">
      <h1 className="text-xl font-bold mb-4">Турниры</h1>
      <div className="grid grid-cols-2 max-md:grid-cols-1 justify-center gap-4">
        {tournaments.map((tournament, index) => (
            <Link className="w-full" to={pathKeys.tournaments.bySlug(String(tournament.id))} key={index}>
            <Paper sx={{ mb: 2, p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: "#f1f1f1" }}>
                <Box mb={3}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {tournament.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <strong>Дата:</strong> {tournament.date}
                </Typography>
                </Box>
                <Box className="flex max-md:flex-col" justifyContent="space-between" mb={2}>
                <Typography variant="body2">
                    <strong>Всего матчей:</strong> {tournament.games.length}
                </Typography>
                <Typography variant="body2">
                    <strong>Всего команд:</strong> {tournament.teamsSum}
                </Typography>
                </Box>
            </Paper>
            </Link>
        ))}
      </div>
    </Container>
  );
};

