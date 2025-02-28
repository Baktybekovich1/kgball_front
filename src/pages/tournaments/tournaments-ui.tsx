import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Avatar, Divider } from "@mui/material";
import { pathKeys } from "~shared/lib/react-router";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "~shared/lib/api";

import teamPhoto from "../../shared/assets/img/50080 1.png";
import playerPhoto from "../../shared/assets/img/player.png";


const playersData = [
  { id: 1, name: "Игрок 1", team: "Команда 1", photo: playerPhoto, position: "Нападающий" },
  { id: 2, name: "Игрок 2", team: "Команда 2", photo: playerPhoto, position: "Полузащитник" },
  { id: 3, name: "Игрок 3", team: "Команда 3", photo: playerPhoto, position: "Защитник" },
  { id: 4, name: "Игрок 4", team: "Команда 4", photo: playerPhoto, position: "Вратарь" },
];


export const TournamentsPage: React.FC = () => {
  
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState(null);

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
        apiClient.get(`/tourney/review/${id}`)
          .then(response => {
            console.log("Server response:", response);
            console.log("Tourney data:", response.data.tournament);
            setTournament(response.data.tournament);  
          })
          .catch(error => {
            console.error("API Error:", error);
            setError("Ошибка загрузки данных турнира");
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
                Команды: 8
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3 font-semibold">
                Матчи: 20
              </Typography>

              <Typography className="col-span-2 max-md:text-base sm:col-span-3 text-lg font-bold text-black mt-2">
                Рейтинг команд
              </Typography>
              
              {["1. Команда 1", "2. Команда 2", "3. Команда 3"].map((team, index) => (
                <Typography key={index} className="bg-white max-md:text-xs text-black rounded-lg p-3">
                  {team}
                </Typography>
              ))}

              <Typography className="col-span-2 max-md:text-base sm:col-span-3 text-lg font-bold text-black mt-2">
                Статистика игроков
              </Typography>

              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Бомбардиры: 5
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Ассистенты: 4
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Всего голов: 40
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Голевые передачи: 25
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Пенальти: 3
              </Typography>
              <Typography className="bg-white max-md:text-xs text-black rounded-lg p-3">
                Авто голы: 2
              </Typography>
            </Box>
          </div>
        ) : null;
        case "бомбардиры":
          return (
            <div className="w-full">
              <Typography className="mb-2" variant="h5">Бомбардиры</Typography>
              <TableContainer className="w-full" component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Фото</TableCell>
                      <TableCell>Имя</TableCell>
                      <TableCell>Команда</TableCell>
                      <TableCell>Позиция</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {playersData.map(player => (
                      <TableRow key={player.id}>
                        <TableCell>
                          <img className="w-12" src={player.photo} />
                        </TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.team}</TableCell>
                        <TableCell>{player.position}</TableCell>
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
                      <TableCell>Команда</TableCell>
                      <TableCell>Позиция</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {playersData.map(player => (
                      <TableRow key={player.id}>
                        <TableCell>
                          <img className="w-12" src={player.photo} />
                        </TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.team}</TableCell>
                        <TableCell>{player.position}</TableCell>
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
                      <TableCell>Команда</TableCell>
                      <TableCell>Позиция</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {playersData.map(player => (
                      <TableRow key={player.id}>
                        <TableCell>
                          <img className="w-12" src={player.photo} />
                        </TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.team}</TableCell>
                        <TableCell>{player.position}</TableCell>
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
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}>
              {tournament.tournament}
            </Typography>
          </Box>
        
          <Box className="flex gap-5 justify-center items-center mb-4">
            <Typography variant="h5" color="textSecondary">
              Winner:
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              {/* {teams.map((team) => {
                if (team.name === tournament.winner) {
                  return (
                    <div key={team.name} className="flex flex-col items-center">
                      <img alt={team.name} src={team.photo} className="w-[100px] h-[100px] " />
                      <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
                        {team.name}
                      </Typography>
                    </div>
                  );
                }
              })} */}
            </Box>
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
            // const winnerTeam = teams.find((team) => team.name === tournament.winner);

            return (
              <Link to={pathKeys.tournaments.bySlug(String(tournament.id))} key={index}>
                <Paper sx={{ mb: 4, p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: "#f9f9f9" }}>
                  <Box mb={3}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {tournament.tournament}
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
                      <strong>Total Goals:</strong> {tournament.teams_sum + tournament.teamsSum}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="primary">
                      Winner:{" "}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        {/* <Avatar alt={winnerTeam.name} src={winnerTeam.photo} sx={{ width: 40, height: 40 }} /> */}
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
