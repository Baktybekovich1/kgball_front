import { Container, Box, Typography, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { PlayerCard } from '~widgets/playerCard/playerCard.ui';
import { Star} from 'lucide-react';

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


      <Box className="">
        <div
          className={`mb-12 p-6 rounded-xl shadow-lg`}
        >
          <div className="flex items-center mb-6">
            <Star className="w-6 h-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-bold">
              {selectedCategory === "bombers" && "Топ 3 бомбардиров"}
              {selectedCategory === "assistants" && "Топ 3 ассистентов"}
              {selectedCategory === "all" && "Топ 3 игроков по общим очкам"}
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            {selectedPlayers.map((player, index) => (
              <div
                className={`p-4 rounded-lg`}
              >
                <Typography className="mt-2" variant="body2" fontWeight="bold">
                  {index + 1} место
                </Typography>
                <PlayerCard player={player} />
                <div className="text-sm text-gray-500">{player.team}</div>
                  <div className="mt-2 flex justify-between">
                    <span>Голы: {player.goals}</span>
                    <span>Передачи: {player.assists}</span>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </Box>
    </Container>
  );
};
