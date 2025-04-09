import { Container, Box, Typography, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { PlayerCard } from '~widgets/playerCard/playerCard.ui';

export const BestPlayers: React.FC = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

  const topBombers = players
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 3);

  const topAssistants = players
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 3);

  const topPlayers = players
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))
    .slice(0, 3);

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  let selectedPlayers = [];
  if (selectedCategory === "bombers") {
    selectedPlayers = topBombers;
  } else if (selectedCategory === "assistants") {
    selectedPlayers = topAssistants;
  } else if (selectedCategory === "all") {
    selectedPlayers = topPlayers;
  }

  return (
    <Container className="max-w-[1440px] mb-10">
      <Typography className="max-md:text-base" variant="h4" fontWeight="bold" gutterBottom align="center">
        Лучшие игроки
      </Typography>

      <Box className="mb-4 flex max-md:justify-center">
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          size="small"
          sx={{ fontSize: "14px", minWidth: 160 }}
        >
          <MenuItem value="all">Все игроки</MenuItem>
          <MenuItem value="bombers">Топ 3 бомбардиров</MenuItem>
          <MenuItem value="assistants">Топ 3 ассистентов</MenuItem>
        </Select>
      </Box>

      <Typography className="text-xl max-md:text-[16px]" fontWeight="bold" gutterBottom>
        {selectedCategory === "bombers" && "Топ 3 бомбардиров"}
        {selectedCategory === "assistants" && "Топ 3 ассистентов"}
        {selectedCategory === "all" && "Топ 3 игроков по общим очкам"}
      </Typography>

      <Box className="flex max-md:flex-col gap-4 justify-center">
        {selectedPlayers.map((player, index) => (
          <Box className="w-full" key={player.playerId}>
            <Typography className="mt-2" variant="body2" fontWeight="bold">
              {index + 1} место
            </Typography>
            <PlayerCard player={player} />
            <Typography className="mt-2" variant="body2" color="textSecondary">
              Голы: {player.goals}, Ассисты: {player.assists}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};
