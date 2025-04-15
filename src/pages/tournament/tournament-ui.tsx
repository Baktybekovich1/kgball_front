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
    <Container className="max-w-[1440px] font-sans mb-10">
      {tournament ? (
        <div className="flex flex-col items-center justify-center max-md:px-2 max-md:py-2 px-4 py-8">
          <Box className="flex max-md:flex-col max-md:gap-1 max-md:mb-0 w-full gap-5 justify-between items-center mb-4">
            <Link to={pathKeys.matches.root()} className="max-md:p-1 bg-dove mb-1 p-2 rounded text-white inline-block text-blue hover:underline">
              <ArrowBackIcon className="max-md:text-xs"/> Назад
            </Link>
            {winner && (
              <div>
                <img 
                  src={winner.teamLogo || defaultTeam} 
                  alt={winner.teamTitle || "Неизвестная команда"} 
                  className="w-32 h-32 rounded-full border-2 border-gray-300 mx-auto sm:mx-0"
                />
                <Typography className="max-md:text-xl text-bold text-[30px]">
                  Победитель: {winner.teamTitle}
                </Typography>
              </div>
            )}
            <br></br>
          </Box>

          <Box className="w-full max-md:justify-center flex gap-4 mb-6 mt-4 flex-wrap">
            <Button
              variant={selectedTab === "обзор" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("обзор")}
              className="w-full max-w-[200px] mb-2 max-md:max-w-full"
            >
              Обзор
            </Button>
            <Button
              variant={selectedTab === "бомбардиры" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("бомбардиры")}
              className="w-full max-w-[200px] mb-2 max-md:max-w-full"
            >
              Бомбардиры
            </Button>
            <Button
              variant={selectedTab === "ассистенты" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("ассистенты")}
              className="w-full max-w-[200px] mb-2 max-md:max-w-full"
            >
              Ассистенты
            </Button>
            <Button
              variant={selectedTab === "результативные" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("результативные")}
              className="w-full max-w-[200px] mb-2 max-md:max-w-full"
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
              className="w-full max-w-[200px] mb-2 max-md:max-w-full"
            >
              Матчи
            </Button>
          </Box>

          <TourneyContent
            selectedTab={selectedTab}
            tournament={tournament}
            playersData={playersData}
            matches={matches}
          />
        </div>
      ) : (
        <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>
      )}
    </Container>
  );
};
