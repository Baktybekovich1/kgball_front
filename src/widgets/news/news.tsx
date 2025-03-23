import { Container, Paper, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { pathKeys } from "~shared/lib/react-router";
import { Link } from "react-router-dom";

export const News: React.FC = () => {
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

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const latestTournaments = tournaments.slice(0, 3);

  return (
    <Container className="max-w-[1440px] mb-10">
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", marginBottom: 4 }}>Последние турниры</Typography>
      <Box className="flex max:flex-col justify-center gap-4">
        {latestTournaments.map((tournament, index) => (
          <Link className="w-full" to={pathKeys.tournaments.bySlug(String(tournament.id))} key={index}>
            <Paper
              key={index}
              sx={{
                mb: 4, 
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "#f1f1f1",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: 6,
                },
              }}
              className="w-full"
            >
              <Box mb={2}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2C3E50", mb: 1 }}>
                  {tournament.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Дата:</strong> {tournament.date}
                </Typography>
              </Box>
              <Box className="flex max-md:flex-col gap-2">
                <Typography variant="body2" sx={{ color: "#7F8C8D" }}>
                  <strong>Всего матчей:</strong> {tournament.games.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#7F8C8D" }}>
                  <strong>Всего команд:</strong> {tournament.teamsSum}
                </Typography>
              </Box>
            </Paper>
          </Link>
        ))}
      </Box>
    </Container>
  );
};
