import { Link, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { pathKeys } from "~shared/lib/react-router";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const PlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (id) {
      apiClient.get(`/player/statistic/${id}`)
        .then(response => setStats(response.data.player))
        .catch(() => setStats(null));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      apiClient.get(`/player/personal_card/${id}`)
        .then(response => setPlayer(response.data.player))
        .catch(error => console.error("API Error:", error));
    }
  }, [id]);

  if (!player) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container className="max-w-[1200px] mx-auto mb-10 px-4">
      <Box className="flex max-md:flex-col text-center gap-10 mb-6">
        <Link to={pathKeys.players.root()} className="max-md:p-1 bg-dove mb-1 p-2 rounded text-white inline-block text-blue hover:underline">
          <ArrowBackIcon /> Назад
        </Link>
        <Typography fontWeight="bold" className="text-3xl max-md:text-xl mb-2">
          Карточка игрока
        </Typography>
      </Box>

      <Card className="rounded-2xl shadow-xl">
        <CardContent className="p-6 md:p-10">
          <Box className="flex flex-col md:flex-row gap-6 items-center mb-8">
            <img
              src={player.img || DefaultAvatar}
              alt={player.name}
              className="w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-gray-300 object-cover shadow-md"
            />
            <Box className="text-center md:text-left space-y-2">
              <Typography variant="h5" fontWeight="bold">
                {player.surname} {player.name}
              </Typography>
              <Typography color="textSecondary">
                Родился: {player.birthday}
              </Typography>
              <Typography color="textSecondary">
                Команда: {player.teamTitle}
              </Typography>
              <Typography color="textSecondary">
                Позиция: {player.position}
              </Typography>
            </Box>
          </Box>

          <Divider className="my-4" />

          <Box>
            <Typography variant="h6" fontWeight="bold" className="mb-4">
              📊 Статистика
            </Typography>
            <Box className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <StatBox label="Голы" value={stats?.goals ?? 0} />
              <StatBox label="Голы в игре" value={stats?.goalInGames ?? 0} />
              <StatBox label="Пенальти" value={stats?.penalties ?? 0} />
              <StatBox label="Передачи" value={stats?.assists ?? 0} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <Box className="bg-gray-100 rounded-xl py-4 shadow-sm">
    <Typography variant="h6" fontWeight="bold">
      {value}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      {label}
    </Typography>
  </Box>
);
