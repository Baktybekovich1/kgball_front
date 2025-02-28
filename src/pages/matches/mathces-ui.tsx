import React, { useState, useEffect } from "react";
import { Container, Button, Box, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import teamPhoto from "../../shared/assets/img/50080 1.png";
import { pathKeys } from "~shared/lib/react-router";
import { apiClient } from "~shared/lib/api";

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState(null);

  useEffect(() => {
      apiClient.get("api/games")
        .then(response => {
          console.log("API Response:", response.data);
          if (response.data && Array.isArray(response.data)) {
            setMatches(response.data);
          } else {
            setError("Некорректный формат данных от сервера");
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("API Error:", error);
          setError("Ошибка загрузки списка матчей");
          setLoading(false);
        });
    }, []); 

  const [selectedTab, setSelectedTab] = useState<string>("гол");

  const renderContent = () => {
    switch (selectedTab) {
      case "гол":
        return match ? (
          <Box>
            <Typography variant="h6">Голы:</Typography>
          </Box>
        ) : null;
      case "состав":
        return match ? (
          <Box>
            <Typography variant="h6">Состав команд</Typography>
            <div className="flex mb-10">
              <div className="flex-1">
                {/* <Typography variant="h6" fontWeight="bold">{match.team1.name}</Typography> */}
                <Box className="flex flex-col gap-2">
                  {match.team1.players.map((player, index) => (
                    <Typography key={index} variant="body2">{player}</Typography>
                  ))}
                </Box>
              </div>
              <div className="flex-1 text-right">
                {/* <Typography variant="h6" fontWeight="bold">{match.team2.name}</Typography> */}
                <Box className="flex flex-col gap-2">
                  {match.team2.players.map((player, index) => (
                    <Typography key={index} variant="body2">{player}</Typography>
                  ))}
                </Box>
              </div>
            </div>
          </Box>
        ) : null;
      case "статистика":
        return match ? (
          <Box>
            <Typography variant="h6">Статистика встреч</Typography>
          </Box>
        ) : null;
      default:
        return null;
    }
  };

  if (!Array.isArray(matches)) {
    return <Typography color="error">Ошибка загрузки списка матчей</Typography>;
  }

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px]">
      {match ? (
        <>
          <div className="flex justify-between items-center border p-4 rounded-md">
            <div className="items-center">
              {/* <img src={match.team1.photo} alt={match.team1.name} className="w-16 h-16" /> */}
              {/* <h2 className="text-lg font-semibold">{match.team1.name}</h2> */}
              <p className="text-xl">Goals: {match.score1}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold">VS</p>
            </div>
            <div className="items-center">
              {/* <img src={match.team2.photo} alt={match.team2.name} className="w-16 h-16" /> */}
              {/* <h2 className="text-lg font-semibold">{match.team2.name}</h2> */}
              <p className="text-xl">Goals: {match.score2}</p>
            </div>
          </div>

          <Box className="flex gap-4 mb-6 mt-2">
            <Button className="max-md:text-xs"
              variant={selectedTab === "гол" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("гол")}
              fullWidth
            >
              Гол
            </Button>
            <Button className="max-md:text-xs"
              variant={selectedTab === "состав" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("состав")}
              fullWidth
            >
              Состав
            </Button>
            <Button className="max-md:text-xs"
              variant={selectedTab === "статистика" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("статистика")}
              fullWidth
            >
              Статистика встреч
            </Button>
          </Box>

          <Box>{renderContent()}</Box>
        </>
      ) : (
        <>
          <Typography variant="h5" className="font-bold mb-4">Матчи</Typography>
          <div className="grid w-full max-md:grid-cols-1 grid-cols-2 gap-4">
            {matches.map((match, index) => (
              <div className="flex-1 sm:w-[48%] md:w-[30%]" key={index}>
                <Link to={pathKeys.matches.bySlug(String(match.id))} className="border p-4 rounded-md block">
                  <Box className="flex items-center justify-between ">
                    <div className="flex flex-col items-center">
                      {/* <img src={match.team1.photo} alt={match.winnerTeam.title} className="w-10 h-10" /> */}
                      <span className="text-lg font-semibold">{match.winnerTeam}</span>
                    </div>
                    <span className="text-md">{match.date}</span>
                    <div className="flex flex-col items-center">
                      {/* <img src={match.team2.photo} alt={match.team2.name} className="w-10 h-10" /> */}
                      <span className="text-lg font-semibold">{match.loserTeam}</span>
                    </div>
                  </Box>
                  <Box className="flex justify-between">
                    <span className="text-md">Score: {match.tourney.teams_sum}</span>
                    <span className="text-md">Score: {match.tourney.teams_sum}</span>
                  </Box>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};
