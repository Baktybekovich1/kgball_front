import { Link, useParams } from "react-router-dom";
import { Container, Box, Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useState, useEffect } from "react";
import { pathKeys } from "~shared/lib/react-router";
import { apiClient } from "~shared/lib/api";
import DefaultAvatar from "~shared/assets/img/User-avatar.png"

export const PlayersPage: React.FC = () => {
  
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const { id } = useParams<{ id: string }>();

  const [player, setPlayer] = useState(null);
  const [tab, setTab] = useState<'stats' | 'awards'>('stats');
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [stats, setStats] = useState(null);


  useEffect(() => {
    apiClient.get("/player/list")
      .then(response => {
        console.log("API Response:", response.data);
        if (response.data && Array.isArray(response.data.players)) {
          setPlayers(response.data.players);
        } else {
          setError("Некорректный формат данных от сервера");
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("API Error:", error);
        setError("Ошибка загрузки списка игроков");
        setLoading(false);
      });
  }, []); 
  

  useEffect(() => {
    if (id) {
      apiClient.get(`/player/statistic/${id}`)
        .then(response => setStats(response.data))
        .catch(() => setStats(null));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      apiClient.get(`/player/personal_card/${id}`)
      .then(response => {
        console.log("Server response:", response);
        console.log("Player data:", response.data.player);  
        setPlayer(response.data.player);  
      })
      .catch(error => {
        console.error("API Error:", error);
        setError("Ошибка загрузки данных игрока");
      });

    }
  }, [id]);
  

  const filteredPlayers = players.filter(player => {
    if (filter === "bombers") return player.goals > 0;
    if (filter === "assistants") return player.assists > 0;
    return true;
  });

  if (!Array.isArray(players)) {
    return <Typography color="error">Ошибка загрузки списка игроков</Typography>;
  }

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10">
      <Typography className="max-md:text-xl" variant="h4" fontWeight="bold" gutterBottom align="center">
        {player ? "Карточка игрока" : "Список игроков"}
      </Typography>

      {!player && (
        <Box className="max-md:text-sm mb-4 flex gap-2 justify-center text-center">
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="all">Весь cписок</MenuItem>
            <MenuItem value="bombers">Бомбардиры</MenuItem>
            <MenuItem value="assistants">Ассистенты</MenuItem>
          </Select>
          <Button className="max-md:text-xs" variant={view === 'cards' ? "contained" : "outlined"} onClick={() => setView('cards')}>Карточки</Button>
          <Button className="max-md:text-xs" variant={view === 'table' ? "contained" : "outlined"} onClick={() => setView('table')}>Таблица</Button>
        </Box>
      )}

      {player ? (
        <Card className="p-6 rounded-lg shadow-lg">
          <Box className="flex flex-col sm:flex-row items-center mb-6 space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="flex max-md:flex-col items-center gap-6">
              <img src={player.photo || DefaultAvatar} alt={player.name} className="w-32 h-32 rounded-full border-2 border-gray-300 mx-auto sm:mx-0" />
              <div>
                <Typography variant="h5" fontWeight="bold" className="center sm:text-left">{player.surname}{player.name}</Typography>
                <Typography color="textSecondary" className="center sm:text-left">Родился: {player.birthday}</Typography>
                <Typography color="textSecondary" className="center sm:text-left">Команда: {player.teamTitle}</Typography>
                <Typography color="textSecondary" className="center sm:text-left">Позиция: {player.position}</Typography>
              </div>
            </div>
          </Box>

          <Box className="mb-6 flex gap-3 max-md:justify-center">
            <Button variant={tab === 'stats' ? "contained" : "outlined"} onClick={() => setTab('stats')}>Статистика</Button>
            <Button variant={tab === 'awards' ? "contained" : "outlined"} onClick={() => setTab('awards')}>Награды</Button>
          </Box>

          {tab === 'stats' && stats ? (
            <Box>
              <Typography variant="h6" fontWeight="bold">Статистика</Typography>
              <Typography color="textSecondary">Голы: {player.goals}</Typography>
              <Typography color="textSecondary">Пенальти: {player.penalties}</Typography>
              <Typography color="textSecondary">Голевые передачи: {player.assists}</Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" fontWeight="bold">Награды</Typography>
              {/* {player.awards.length > 0 ? (
                <ul className="list-disc pl-6">
                  {player.awards.map((award, index) => (
                    <li key={index} className="text-gray-600">{award}</li>
                  ))}
                </ul>
              ) : (
                <Typography color="textSecondary">Наград нет</Typography>
              )} */}
            </Box>
          )}

          <Link to={pathKeys.players.root()} className="mt-6 inline-block text-blue hover:underline">Назад к списку</Link>
        </Card>
      ) : view === 'cards' ? (
        <Box className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
          {filteredPlayers.map(player => (
            <Link to={pathKeys.players.bySlug(String(player.id))} key={player.id}>
              <Card className="p-4 rounded-lg shadow-md hover:shadow-lg transition">
                <CardContent className="flex justify-between">
                  <div className="flex sm:flex-row items-center gap-4">
                  <img src={player.photo || DefaultAvatar} alt={player.name} className="w-16 h-16 rounded-full border-2 border-gray-300" />
                  <div className="">
                      <div className="text-lg font-semibold">{player.name} {player.surname}</div>
                      <Typography color="textSecondary">Команда: {player.teamName}</Typography>
                      <Typography color="textSecondary">Позиция: {player.position}</Typography>
                    </div>
                  </div>
                  {(filter === "bombers" || filter === "assistants") && (
                    <Typography color="black">Голы: {player.goals}</Typography>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Имя</TableCell>
                <TableCell>Команда</TableCell>
                <TableCell>Позиция</TableCell>
                {(filter === "bombers" || filter === "assistants") && (
                  <TableCell>Голы</TableCell>
                )}
                <TableCell>Действие</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="">
              {filteredPlayers.map(player => (
                <TableRow key={player.id}>
                  <TableCell>{player.name} {player.surname}</TableCell>
                  <TableCell>{player.teamName}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  {(filter === "bombers" || filter === "assistants") && (
                    <TableCell>{player.goals}</TableCell>
                  )}
                  <TableCell>
                    <Link to={pathKeys.players.bySlug(String(player.id))} className="text-blue hover:underline">Подробнее</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
