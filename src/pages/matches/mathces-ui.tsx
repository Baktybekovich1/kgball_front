import React, { useState, useEffect } from "react";
import { Container, Button, Box, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "~shared/lib/api";

import DefaultAvatar from "~shared/assets/img/User-avatar.png"

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);  
  const [teams, setTeams] = useState<any[]>([]);  
  const [statistics, setStatistics] = useState<any>(null);  // Add state for statistics

  useEffect(() => {
    apiClient.get("api/games")
      .then(response => {
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

  useEffect(() => {
    if (id) {
      apiClient.get(`/api/games/${id}`)
        .then(response => {
          if (response.data && typeof response.data === 'object') {
            const selectedMatch = response.data;

            Promise.all([
              apiClient.get(selectedMatch.winnerTeam),
              apiClient.get(selectedMatch.loserTeam),
            ])
            .then(([winnerResponse, loserResponse]) => {
              setMatch({
                ...selectedMatch,
                winnerTeamData: winnerResponse.data,
                loserTeamData: loserResponse.data,
              });
            })
            .catch((error) => {
              console.error("Error fetching team data or goals:", error);
              setError("Ошибка загрузки данных команд или голов");
            });
          } else {
            setError("Неверный формат данных от сервера");
          }
        })
        .catch(error => {
          console.error("API Error:", error);
          setError("Ошибка загрузки данных матча");
        });
        apiClient.get(`/game/scores/${id}`)
        .then(goalsResponse => {
          console.log("Goals data:", goalsResponse.data);  
          const goalsData = Array.isArray(goalsResponse.data) ? goalsResponse.data : [goalsResponse.data]; 
          setGoals(goalsData);  
        })
        .catch((error) => {
          console.error("Error fetching goals:", error);
          setError("Ошибка загрузки данных голов");
        });

      apiClient.get(`/team/squad_list/${id}`)
      .then(teamsResponse => {
        console.log("Team data:", teamsResponse.data); 
        const teamsData = Array.isArray(teamsResponse.data) ? teamsResponse.data : [teamsResponse.data]; 
        setTeams(teamsData);  
      })
      .catch((error) => {
        console.error("Error fetching goals:", error);
        setError("Ошибка загрузки данных голов");
      });
    }
  }, [id]);

  const [selectedTab, setSelectedTab] = useState<string>("гол");

  const renderContent = () => {
    switch (selectedTab) {
      case "гол":
        return match ? (
          <Box>
          <Typography variant="h6">Голы:</Typography>
            {Array.isArray(goals) && goals.length > 0 ? (
              goals.map((goal: any, index: number) => (
                <Box className="flex justify-between" key={index} mb={2}>
                  <Typography className="max-md:text-xl text-[25px]">{goal.loserTeamTitle} - {goal.loserTeamScore}</Typography>
                  <Typography className="max-md:text-xl text-[25px]">{goal.winnerTeamTitle} - {goal.winnerTeamScore}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2">No goals available</Typography>
            )}
          </Box>

        ) : null;
      case "состав":
        return match ? (
          <Box>
            <Typography variant="h6">Состав команд</Typography>
            <div className="flex mb-10">
              <div className="flex-1">
                <Typography variant="h6">{match.loserTeamData.title}</Typography>
                <Box className="flex flex-col gap-2">
                  {teams.filter((team: any) => team.teamTitle === match.loserTeamData.title).map((team: any, index: number) => (
                    team.players.map((player: any) => (
                      <Box key={player.id} className="flex justify-between items-center">
                        <Typography>{player.name}</Typography>
                        <Typography>{player.position}</Typography>
                      </Box>
                    ))
                  ))}
                </Box>
              </div>
              <div className="flex-1 text-right">
                <Typography variant="h6">{match.winnerTeamData.title}</Typography>
                <Box className="flex flex-col gap-2">
                  {teams.filter((team: any) => team.teamTitle === match.winnerTeamData.title).map((team: any, index: number) => (
                    team.players.map((player: any) => (
                      <Box key={player.id} className="flex justify-between items-center">
                        <Typography>{player.name}</Typography>
                        <Typography>{player.position}</Typography>
                      </Box>
                    ))
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

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px]">
      {match ? (
        <>
          <div className="flex justify-between items-center border p-4 rounded-md">
            <div className="items-center">
              <img src={match.loserTeamData.logo || DefaultAvatar} alt={match.loserTeamData.title} className="w-16 h-16" />
              <h2 className="text-lg font-semibold">{match.loserTeamData.title}</h2>
              <p className="text-xl">Goals: {match.loserTeamData.goals.length}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold">VS</p>
            </div>
            <div className="items-center">
              <img src={match.winnerTeamData.logo || DefaultAvatar} alt={match.winnerTeamData.title} className="w-16 h-16" />
              <h2 className="text-lg font-semibold">{match.winnerTeamData.title}</h2>
              <p className="text-xl">Goals: {match.winnerTeamData.goals.length}</p>
            </div>
          </div>

          <Box className="flex gap-4 mb-6 mt-2">
            <Button
              variant={selectedTab === "гол" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("гол")}
              fullWidth
            >
              Гол
            </Button>
            <Button
              variant={selectedTab === "состав" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("состав")}
              fullWidth
            >
              Состав
            </Button>
            <Button
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
                <Link to={`/matches/${match.id}`} className="border p-4 rounded-md block">
                  <Box className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-semibold">{match.winnerTeam}</span>
                    </div>
                    <span className="text-md">{match.date}</span>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-semibold">{match.loserTeam}</span>
                    </div>
                  </Box>
                  <Box className="flex justify-between">
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
