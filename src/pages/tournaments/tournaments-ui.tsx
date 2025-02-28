import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Avatar, Divider } from "@mui/material";
import { pathKeys } from "~shared/lib/react-router";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "~shared/lib/api";

import DefaultAvatar from "~shared/assets/img/User-avatar.png"


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

      // Fetch best players data (bombardiers, assistants, resultative players)
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

  const renderContent = () => {
    switch (selectedTab) {
      case "обзор":
        return tournament ? (
          <div className="w-full">
            <Typography variant="h6" fontWeight="bold">Обзор турнира</Typography>
            <Box className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2 p-4 bg-tundora rounded-lg shadow-lg">
              <Typography className="col-span-2 max-md:text-base sm:col-span-3 text-lg font-bold text-black">
                Турнирная статистика
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3 font-semibold">
                Команды: {tournament.teamsCount}
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3 font-semibold">
                Матчи: {tournament.gamesCount} 
              </Typography>
              <Typography className="col-span-2 max-md:text-base sm:col-span-3 text-lg font-bold text-black mt-2">
                Рейтинг команд
              </Typography>
              {[
                { title: tournament.firstPosition.teamTitle, goals: tournament.firstPosition.goalsCount },
                { title: tournament.secondPosition.teamTitle, goals: tournament.secondPosition.goalsCount },
                { title: tournament.thirdPosition.teamTitle, goals: tournament.thirdPosition.goalsCount }
              ].map((team, index) => (
                <div key={index} className="flex max-md:flex-col justify-between bg-white max-md:text-xs text-black rounded-lg p-3">
                  <div className="flex gap-2">
                    <Typography className="max-md:hidden">{index + 1}.</Typography> 
                    <Typography>{team.title}</Typography>
                  </div>
                  <Typography className="text-bold">Голы: {team.goals}</Typography>
                </div>
              ))}


              <Typography className="col-span-2 max-md:text-base sm:col-span-3 text-lg font-bold text-black mt-2">
                Статистика игроков
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Бомбардиры: {playersData.filter(player => player.goals > 0).length}
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Ассистенты: {playersData.filter(player => player.assists > 0).length}
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Всего голов: {tournament.firstPosition.goalsCount + tournament.secondPosition.goalsCount + tournament.thirdPosition.goalsCount}
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Голевые передачи: {tournament.firstPosition.assistsCount + tournament.secondPosition.assistsCount + tournament.thirdPosition.assistsCount}
              </Typography>
              {/* <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Пенальти: 3
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Авто голы: 2
              </Typography> */}
            </Box>
          </div>
        ) : null;
  
      case "бомбардиры":
        return (
          <div className="w-full">
            <Typography className="mb-2" variant="h5">Бомбардиры</Typography>
            <TableContainer className="w-full " component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Фото</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Голы</TableCell>
                    <TableCell>Голевые передачи</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playersData.filter(player => player.goals > 0).map(player => (
                    <TableRow key={player.playerId}>
                      <TableCell>
                        <img className="w-12" src={player.photo || DefaultAvatar} />
                      </TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.goals}</TableCell>
                      <TableCell>{player.assists}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );
  
      case "ассистенты":
        return (
          <>
            <Typography className="mb-2" variant="h5">Ассистенты</Typography>
            <TableContainer className="w-full " component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Фото</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Голы</TableCell>
                    <TableCell>Голевые передачи</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playersData.filter(player => player.assists > 0).map(player => (
                    <TableRow key={player.playerId}>
                      <TableCell>
                        <img className="w-12" src={player.photo || DefaultAvatar} />
                      </TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.goals}</TableCell>
                      <TableCell>{player.assists}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );
  
      case "результативные":
        return (
          <>
            <Typography className="mb-2" variant="h5">Результативные</Typography>
            <TableContainer className="w-full " component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Фото</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Голы</TableCell>
                    <TableCell>Голевые передачи</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playersData.filter(player => player.assists > 0 || player.goals > 0).map(player => (
                    <TableRow key={player.playerId}>
                      <TableCell>
                        <img className="w-12" src={player.photo || DefaultAvatar} />
                      </TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.goals}</TableCell>
                      <TableCell>{player.assists}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );
      default:
        return null;
    }
  };
  

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
          <Box mb={3}>
            <Typography className="text-black" variant="h4" sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}>
              {tournament.title}
            </Typography>
          </Box>

          <Box className="flex gap-5 justify-center items-center mb-4">
            <Typography className="max-md:text-xl text-bold text-[30px]">
              Winner: {tournament.firstPosition.teamTitle}
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

          <Box className="w-full mt-2">{renderContent()}</Box>
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
                      <strong>Date:</strong> {tournament.date}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body2">
                      <strong>Total Matches:</strong> {tournament.games.length}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total Goals:</strong>
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="primary">
                      Winner: {tournament.firstPosition?.teamTitle}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {tournament.match}
                      </Typography>
                    </Box>
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
