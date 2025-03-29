import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, FormControl, InputLabel, Typography } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import { toast } from "react-toastify";

interface AssistDialogProps {
  open: boolean;
  onClose: () => void;
  gameId: number;
  goals: any[];
  teams: any[];
  setMatches: React.Dispatch<React.SetStateAction<any[]>>;
  selectedMatch: any;
  selectedAssist: any;
}
export const AssistDialog: React.FC<AssistDialogProps> = ({
  open, onClose, gameId, goals, teams, setMatches, selectedMatch, selectedAssist
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null); 
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const matchTeams = teams.filter(
    (team) => team.id === selectedMatch?.winnerTeamId || team.id === selectedMatch?.loserTeamId
  );

  useEffect(() => {
    if (selectedTeamId) {
      const fetchPlayers = async () => {
        try {
          const response = await apiClient.get(`/team/squad_list/${selectedTeamId}`);
          if (response.data?.players && Array.isArray(response.data.players)) {
            setPlayers(response.data.players);
          } else {
            setError("Некорректный формат данных состава команды");
          }
        } catch (error) {
          console.error("Ошибка при загрузке игроков:", error);
          setError("Не удалось загрузить игроков");
        }
      };

      fetchPlayers();
    } else {
      setPlayers([]);
    }
  }, [selectedTeamId]);

  const handleAssistSubmit = useCallback(async () => {
    if (!selectedPlayerId || !selectedGoalId) {
      toast.error("Пожалуйста, выберите все поля.");
      return;
    }

    setLoading(true);

    const assistData = {
      playerId: selectedPlayerId,
      goalId: selectedGoalId,
    };

    try {
      if (selectedAssist) {
        await apiClient.patch(`/api/admin/assist/edit/${selectedAssist.assistId}`, assistData);
        toast.success("Ассист обновлён успешно");
      } else {
        await apiClient.post("/api/admin/assist/add", assistData);
        toast.success("Ассист добавлен успешно");
      }

      setMatches((prevMatches) => prevMatches.map((match) =>
        match.id === gameId ? { ...match, assists: [...match.assists, { playerId: selectedPlayerId, goalId: selectedGoalId }] } : match
      ));
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при добавлении/редактировании ассиста:", error);
      toast.error("Не удалось обработать ассист");
    } finally {
      setLoading(false);
    }
  }, [gameId, selectedPlayerId, selectedGoalId, setMatches, onClose, selectedAssist]);

  const handleClose = () => {
    setSelectedTeamId(null);
    setSelectedPlayerId(null);
    setSelectedGoalId(null);
    setPlayers([]);
    onClose();
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedAssist ? "Редактировать ассист" : "Добавить ассист"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Команда</InputLabel>
          <Select
            value={selectedTeamId || ""}
            onChange={(e) => setSelectedTeamId(Number(e.target.value))}
            label="Команда"
          >
            {matchTeams.map((team) => (
              <MenuItem key={team.id} value={team.id}>{team.title}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Игрок</InputLabel>
          <Select
            value={selectedPlayerId || ""}
            onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
            label="Игрок"
            disabled={!selectedTeamId}
          >
            {players.length > 0 ? (
              players.map((player) => (
                <MenuItem key={player.id} value={player.id}>{player.name}</MenuItem>
              ))
            ) : (
              <MenuItem disabled>Нет игроков</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Гол</InputLabel>
          <Select
            value={selectedGoalId || ""}
            onChange={(e) => setSelectedGoalId(Number(e.target.value))}
            label="Гол"
          >
            {selectedTeamId && (
              (selectedTeamId === selectedMatch?.winnerTeamId ? 
                [...goals.winnerTeamGoals] : 
                [...goals.loserTeamGoals])
                .filter(goal => !goal.assistId) //Фильтр для ассистов
                .length > 0 ? (
                  (selectedTeamId === selectedMatch?.winnerTeamId ? 
                    [...goals.winnerTeamGoals] : 
                    [...goals.loserTeamGoals])
                    .filter(goal => !goal.assistId)// фильтр если ли уже ассист у гола
                    .map((goal) => (
                      <MenuItem sx={{ display: "flex", justifyContent: 'space-between' }} key={goal.goalId} value={goal.goalId}>
                        <div>{`Гол ${goal.goalAuthor.playerName}`}</div>
                        <div>{goal.goalId}</div>
                      </MenuItem>
                    ))
                ) : (
                  <MenuItem disabled>Нет доступных голов</MenuItem>
                )
            )}
          </Select>
        </FormControl>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Отмена</Button>
        <Button onClick={handleAssistSubmit} color="primary" disabled={loading}>
          {selectedAssist ? "Сохранить изменения" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
