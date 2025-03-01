import { Link, useParams } from "react-router-dom";
import { Container, Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { pathKeys } from "~shared/lib/react-router";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";

export const PlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [tab, setTab] = useState<'stats' | 'awards'>('stats');

  useEffect(() => {
    if (id) {
      apiClient.get(`/player/statistic/${id}`)
        .then(response => {
          setStats(response.data.player);
        })
        .catch(() => setStats(null));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      apiClient.get(`/player/personal_card/${id}`)
        .then(response => {
          setPlayer(response.data.player);
        })
        .catch(error => {
          console.error("API Error:", error);
        });
    }
  }, [id]);

  if (!player) return <Typography>Загрузка...</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10">
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        Карточка игрока
      </Typography>

      <Card className="p-6 rounded-lg shadow-lg">
        <Box className="flex flex-col sm:flex-row items-center mb-6 space-y-6 sm:space-y-0 sm:space-x-6">
          <div className="flex max-md:flex-col items-center gap-6">
            <img src={player.photo || DefaultAvatar} alt={player.name} className="w-32 h-32 rounded-full border-2 border-gray-300 mx-auto sm:mx-0" />
            <div>
              <Typography variant="h5" fontWeight="bold">{player.surname} {player.name}</Typography>
              <Typography color="textSecondary">Родился: {player.birthday}</Typography>
              <Typography color="textSecondary">Команда: {player.teamTitle}</Typography>
              <Typography color="textSecondary">Позиция: {player.position}</Typography>
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
            <Typography color="textSecondary">Голы: {stats.goals}</Typography>
            <Typography color="textSecondary">Голы в игре: {stats.goalInGames}</Typography>
            <Typography color="textSecondary">Пенальти: {stats.penalties}</Typography>
            <Typography color="textSecondary">Голевые передачи: {stats.assists}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" fontWeight="bold">Награды</Typography>
            {/* Awards List */}
          </Box>
        )}

        <Link to={pathKeys.players.root()} className="mt-6 inline-block text-blue hover:underline">Назад к списку</Link>
      </Card>
    </Container>
  );
};
