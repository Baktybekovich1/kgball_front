import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Card,
  CardContent,
  Paper
} from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const PlayerTransferPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedFromTeamId, setSelectedFromTeamId] = useState<number | null>(null);
  const [selectedToTeamId, setSelectedToTeamId] = useState<number | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  useEffect(() => {
    apiClient.get("/api/teams")
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          toast.error("Некорректный формат данных от сервера");
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Ошибка загрузки списка команд");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedFromTeamId) {
      const fetchPlayers = async () => {
        try {
          const response = await apiClient.get(`/team/squad_list/${selectedFromTeamId}`);
          if (response.data?.players && Array.isArray(response.data.players)) {
            setPlayers(response.data.players);
          } else {
            toast.error("Некорректный формат данных состава команды");
          }
        } catch (error) {
          console.error("Ошибка при загрузке игроков:", error);
          toast.error("Не удалось загрузить игроков");
        }
      };

      fetchPlayers();
    } else {
      setPlayers([]);
    }
  }, [selectedFromTeamId]);

  const handleTransfer = async () => {
    if (!selectedPlayerId || !selectedToTeamId) {
      toast.warn("Выберите игрока и команду назначения");
      return;
    }

    try {
      await apiClient.patch("/api/admin/player/transfer", {
        playerId: selectedPlayerId,
        teamId: selectedToTeamId
      });
      toast.success("Игрок успешно переведён");
    } catch (error) {
      console.error("Ошибка при трансфере:", error);
      toast.error("Ошибка при трансфере игрока");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box className="flex max-md:flex-col gap-4 mb-2">
          <Link to={pathKeys.dashboard.root()} className="max-md:p-1 bg-dove mb-1 p-2 rounded text-white inline-block text-blue hover:underline">
              <ArrowBackIcon /> Назад
          </Link>
          <Typography className="text-3xl max-md:text-xl" fontWeight={600}>
            Перевод игрока
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={3}>
          <FormControl fullWidth>
            <InputLabel>Команда (откуда)</InputLabel>
            <Select
              value={selectedFromTeamId ?? ""}
              onChange={(e) => {
                setSelectedFromTeamId(Number(e.target.value));
                setSelectedPlayerId(null);
              }}
              label="Команда (откуда)"
            >
              {teams.map(team => (
                <MenuItem key={team.id} value={team.id}>
                  {team.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!players.length}>
            <InputLabel>Игрок</InputLabel>
            <Select
              value={selectedPlayerId ?? ""}
              onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
              label="Игрок"
            >
              {players.map(player => (
                <MenuItem key={player.id} value={player.id}>
                  {player.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Команда (куда)</InputLabel>
            <Select
              value={selectedToTeamId ?? ""}
              onChange={(e) => setSelectedToTeamId(Number(e.target.value))}
              label="Команда (куда)"
            >
              {teams
                .filter(team => team.id !== selectedFromTeamId)
                .map(team => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleTransfer}
            disabled={loading}
          >
            Подтвердить перевод
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PlayerTransferPage;
