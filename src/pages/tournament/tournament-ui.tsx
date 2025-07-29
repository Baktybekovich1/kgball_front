// TournamentPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Container, Box, Button, Typography, CircularProgress } from "@mui/material";
import { pathKeys } from "~shared/lib/react-router";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "~shared/lib/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TourneyContent } from "~widgets/TourneyContent/TouneyContent.ui";
import defaultTeam from "~shared/assets/img/defaultTeam.webp";

export const TournamentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const [tournament, setTournament] = useState<any>(null);
  const [playersData, setPlayersData] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("обзор");
  const [error, setError] = useState<string>("");
  const [winner, setWinner] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);

  const fetchMatches = useCallback(async (tourneyId: number) => {
      try {
        const response = await apiClient.get(`/game/tourney/games/${tourneyId}`);
        setMatches(response.data); 
      } catch (error) {
        console.error("Ошибка при загрузке матчей:", error);
      }
    }, []);

  useEffect(() => {
    if (id) {
      apiClient.get(`tourney/review/${id}`)
        .then(response => {
          if (response.data) {
            setTournament(response.data);
          } else {
            setError("Турнир не найден");
          }
        })
        .catch(error => {
          console.error("API Error:", error);
          setError("Ошибка загрузки данных турнира");
        });
    }
  }, [id]);
  
  useEffect(() => {
    if (id) {
      apiClient.get(`tourney/best_players/${id}`)
        .then(response => {
          if (response.data) {
            setPlayersData(response.data);
          } else {
            setError("Ошибка загрузки данных игроков");
          }
        })
        .catch(error => {
          console.error("API Error:", error);
          setError("Ошибка загрузки данных игроков");
        });
    }
  }, [tournament]); // Запрос игроков только после загрузки турнира
  
  useEffect(() => {
    if (id) {
      apiClient.get(`tourney/winner/${id}`)
        .then(response => {
          if (response.data) {
            setWinner(response.data);
          } else {
            setError("Информация о победителе не найдена");
          }
        })
        .catch(error => {
          console.error("API Error:", error);
          setError("Ошибка загрузки данных победителя");
        });
    }
  }, [id]);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1100px] font-sans mb-10">
      {tournament ? (
        <div className="flex flex-col items-center justify-center px-2 py-8">
          <Box className="flex flex-col w-full gap-6 mb-8">
            <div className="flex items-center gap-4">
              <Link to={pathKeys.matches.root()} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition">
                <ArrowBackIcon fontSize="small"/> Назад
              </Link>
            </div>
            {winner && (
              <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                <img 
                  src={winner.teamLogo || defaultTeam} 
                  alt={winner.teamTitle || "Неизвестная команда"} 
                  className="w-28 h-28 rounded-full border-4 border-blue-200 mb-2 shadow"
                />
                <Typography className="text-xl font-bold text-blue-800 mt-2">
                  Победитель турнира: {winner.teamTitle}
                </Typography>
              </div>
            )}
          </Box>
          <Box className="flex flex-wrap gap-3 justify-center mb-8">
            <Button
              variant={selectedTab === "обзор" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("обзор")}
              sx={{ minWidth: 140, fontWeight: 600, borderRadius: 8, fontSize: 16, background: selectedTab === "обзор" ? '#2563eb' : '#fff', color: selectedTab === "обзор" ? '#fff' : '#2563eb', borderColor: '#2563eb', '&:hover': { background: '#1e40af', color: '#fff', borderColor: '#1e40af' } }}
            >
              Обзор
            </Button>
            <Button
              variant={selectedTab === "бомбардиры" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("бомбардиры")}
              sx={{ minWidth: 140, fontWeight: 600, borderRadius: 8, fontSize: 16, background: selectedTab === "бомбардиры" ? '#2563eb' : '#fff', color: selectedTab === "бомбардиры" ? '#fff' : '#2563eb', borderColor: '#2563eb', '&:hover': { background: '#1e40af', color: '#fff', borderColor: '#1e40af' } }}
            >
              Бомбардиры
            </Button>
            <Button
              variant={selectedTab === "ассистенты" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("ассистенты")}
              sx={{ minWidth: 140, fontWeight: 600, borderRadius: 8, fontSize: 16, background: selectedTab === "ассистенты" ? '#2563eb' : '#fff', color: selectedTab === "ассистенты" ? '#fff' : '#2563eb', borderColor: '#2563eb', '&:hover': { background: '#1e40af', color: '#fff', borderColor: '#1e40af' } }}
            >
              Ассистенты
            </Button>
            <Button
              variant={selectedTab === "результативные" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("результативные")}
              sx={{ minWidth: 140, fontWeight: 600, borderRadius: 8, fontSize: 16, background: selectedTab === "результативные" ? '#2563eb' : '#fff', color: selectedTab === "результативные" ? '#fff' : '#2563eb', borderColor: '#2563eb', '&:hover': { background: '#1e40af', color: '#fff', borderColor: '#1e40af' } }}
            >
              Результативные
            </Button>
            <Button
              variant={selectedTab === "матчи" ? "contained" : "outlined"}
              onClick={() => {
                if (selectedTab !== "матчи") {
                  fetchMatches(Number(id));
                  setSelectedTab("матчи");
                }
              }}
              sx={{ minWidth: 140, fontWeight: 600, borderRadius: 8, fontSize: 16, background: selectedTab === "матчи" ? '#2563eb' : '#fff', color: selectedTab === "матчи" ? '#fff' : '#2563eb', borderColor: '#2563eb', '&:hover': { background: '#1e40af', color: '#fff', borderColor: '#1e40af' } }}
            >
              Матчи
            </Button>
          </Box>
          <Box className="w-full bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <TourneyContent
              selectedTab={selectedTab}
              tournament={tournament}
              playersData={playersData}
              matches={matches}
            />
          </Box>
        </div>
      ) : (
        <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>
      )}
    </Container>
  );
};
