import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Button, Divider } from "@mui/material";
import { pathKeys } from "~shared/lib/react-router";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "~shared/lib/api";
import { TourneyContent } from "~widgets/TourneyContent/TouneyContent.ui"


export const TournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState(null);
  const [playersData, setPlayersData] = useState<any[]>([]); 

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
  
  useEffect(() => {
    if (id) {
      apiClient.get(`tourney/review/${id}`)
        .then(response => {
          console.log("Server response:", response);
          if (response.data) {
            console.log("Tourney", response.data);
            setTournament(response.data);
          } else {
            setError("Турнир не найден");
          }
        })
        .catch(error => {
          console.error("API Error:", error);
          setError("Ошибка загрузки данных турнира");
        });

      apiClient.get(`team/best_players/${id}`)
        .then(response => {
          console.log("Best Players:", response.data.players);
          if (response.data.players) {
            setPlayersData(response.data.players);
          } else {
            setError("Ошибка загрузки данных игроков");
          }
        })
        .catch(error => {
          console.error("API Error:", error);
          setError("Ошибка загрузки данных игроков");
        });
    }
  }, [id]);

  const [selectedTab, setSelectedTab] = useState<string>("обзор");
  

  if (!Array.isArray(tournaments)) {
    return <Typography color="error">Ошибка загрузки списка турниров</Typography>;
  }

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10">
      {!tournament && <h1 className="text-xl font-bold mb-4">Турниры</h1>}
      {tournament ? (
        <div className="flex flex-col items-center justify-center px-4 py-8">
          {/* <Box mb={3}>
            <Typography className="text-black" variant="h4" sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}>
              {tournament.title}
            </Typography>
          </Box> */}
          <Box className="flex gap-5 justify-center items-center mb-4">
            <Typography className="max-md:text-xl text-bold text-[30px]">
              Победитель: {tournament.firstPosition.teamTitle}
            </Typography>
          </Box>

          <Box className="w-full max-md:justify-center flex gap-4 mb-6 mt-4 flex-wrap">
            <Button
              variant={selectedTab === "обзор" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("обзор")}
              className="w-full max-w-[200px] mb-2"
            >
              Обзор
            </Button>
            <Button
              variant={selectedTab === "бомбардиры" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("бомбардиры")}
              className="w-full max-w-[200px] mb-2"
            >
              Бомбардиры
            </Button>
            <Button
              variant={selectedTab === "ассистенты" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("ассистенты")}
              className="w-full max-w-[200px] mb-2"
            >
              Ассистенты
            </Button>
            <Button
              variant={selectedTab === "результативные" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("результативные")}
              className="w-full max-w-[200px] mb-2"
            >
              Результативные
            </Button>
          </Box>

          <TourneyContent
            selectedTab={selectedTab}
            tournament={tournament}
            playersData={playersData}
          />
        </div>
      ) : (
        <>
          {tournaments.map((tournament, index) => {
            return (
              <Link to={pathKeys.tournaments.bySlug(String(tournament.id))} key={index}>
                <Paper sx={{ mb: 4, p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: "#f9f9f9" }}>
                  <Box mb={3}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {tournament.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Дата:</strong> {tournament.date}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body2">
                      <strong>Всего матчей:</strong> {tournament.games.length}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Всего команд:</strong> {tournament.teamsSum}
                    </Typography>
                  </Box>
                </Paper>
              </Link>
            );
          })}
        </>
      )}
    </Container>
  );
};
