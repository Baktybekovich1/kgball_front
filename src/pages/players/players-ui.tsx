import { Container, Box, Button, Select, MenuItem, Typography, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { PlayerCard } from '~widgets/playerCard/playerCard.ui';
import { PlayerTable } from '~widgets/playerTable/playerTable.ui';

export const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    apiClient.get("/player/best_players")
      .then(response => {
        // Проверка структуры ответа и установка игроков
        if (response.data && Array.isArray(response.data)) {
          console.log(response.data);
          setPlayers(response.data);
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

  const filteredAndSortedPlayers = players
  .filter(player => {
    if (searchQuery && !player.playerName?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filter === "bombers") return player.goals > 0;
    if (filter === "assistants") return player.assists > 0;
    return true;
  })
  .sort((a, b) => {
    if (filter === "bombers") return b.goals - a.goals;
    if (filter === "assistants") return b.assists - a.assists;
    return 0; 
  });


  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10">
      <Typography className="max-md:text-xl" variant="h4" fontWeight="bold" gutterBottom align="center">
        Список игроков
      </Typography>

      <Box className="max-md:flex-col mb-4 flex gap-2 justify-center text-center">
        <Select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          size="small"
          sx={{ fontSize: "14px", minWidth: 120 }}
        >
          <MenuItem value="all">Весь список</MenuItem>
          <MenuItem value="bombers">Бомбардиры</MenuItem>
          <MenuItem value="assistants">Ассистенты</MenuItem>
        </Select>
        <TextField
          label="Поиск по имени"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 180 }}
        />
        <Button 
          variant={view === 'cards' ? "contained" : "outlined"} 
          onClick={() => setView('cards')}
          size="small"
          sx={{ minWidth: 80, padding: "4px 8px", fontSize: "12px" }}
        >Карточки</Button>
        <Button 
          variant={view === 'table' ? "contained" : "outlined"} 
          onClick={() => setView('table')}
          size="small"
          sx={{ minWidth: 80, padding: "4px 8px", fontSize: "12px" }}
        > Таблица</Button>
      </Box>
      {view === 'cards' ? (
        <Box className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
          {filteredAndSortedPlayers.map(player => (
            <PlayerCard key={player.playerId} player={player} />
          ))}
        </Box>
      ) : (
        <Box>
          <PlayerTable players={filteredAndSortedPlayers} />
        </Box>
      )}
    </Container>
  );
};
