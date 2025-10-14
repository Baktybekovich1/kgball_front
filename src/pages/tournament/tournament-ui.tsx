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
          <Box className="flex flex-wrap gap-2 justify-center mb-8 p-4 bg-gray-50 rounded-2xl">
            {[
              { key: "обзор", label: "Обзор", icon: "📊" },
              { key: "бомбардиры", label: "Бомбардиры", icon: "⚽" },
              { key: "ассистенты", label: "Ассистенты", icon: "🎯" },
              { key: "результативные", label: "Результативные", icon: "🏆" },
              { key: "матчи", label: "Матчи", icon: "⚽" }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={selectedTab === tab.key ? "contained" : "outlined"}
                onClick={() => {
                  if (tab.key === "матчи" && selectedTab !== "матчи") {
                    fetchMatches(Number(id));
                  }
                  setSelectedTab(tab.key);
                }}
                sx={{
                  minWidth: { xs: 120, sm: 140 },
                  fontWeight: 600,
                  borderRadius: 3,
                  fontSize: { xs: 14, sm: 16 },
                  px: 3,
                  py: 1.5,
                  background: selectedTab === tab.key 
                    ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' 
                    : '#fff',
                  color: selectedTab === tab.key ? '#fff' : '#2563eb',
                  borderColor: selectedTab === tab.key ? '#2563eb' : '#e5e7eb',
                  borderWidth: 2,
                  boxShadow: selectedTab === tab.key 
                    ? '0 4px 12px rgba(37, 99, 235, 0.3)' 
                    : '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transform: selectedTab === tab.key ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: selectedTab === tab.key 
                      ? 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)'
                      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    color: selectedTab === tab.key ? '#fff' : '#1e40af',
                    borderColor: selectedTab === tab.key ? '#1e40af' : '#2563eb',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(37, 99, 235, 0.2)'
                  }
                }}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </Button>
            ))}
          </Box>
          <Box 
            className="w-full bg-white rounded-2xl shadow-lg border border-blue-100"
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
              minHeight: '400px'
            }}
          >
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
