import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, FormControl, InputLabel, Typography } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import { toast } from "react-toastify";

interface GoalDialogProps {
  open: boolean;
  onClose: () => void;
  gameId: number;
  teams: any[];
  setMatches: React.Dispatch<React.SetStateAction<any[]>>;
  selectedMatch: any;
  selectedGoal: any;  
}

export const GoalDialog: React.FC<GoalDialogProps> = ({ 
  open, onClose, gameId, teams, setMatches, selectedMatch, selectedGoal
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [goalTypeId, setGoalTypeId] = useState<number | null>(null);
  const [goalTypes, setGoalTypes] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const extractIdFromApiUrl = (url: string) => parseInt(url.split("/").pop() || "");
  const winnerTeamId = extractIdFromApiUrl(selectedMatch?.winnerTeam);
  const loserTeamId = extractIdFromApiUrl(selectedMatch?.loserTeam);

  const matchTeams = teams.filter((team) =>
    [winnerTeamId, loserTeamId].includes(team.id)
  );

  useEffect(() => {
    const fetchGoalTypes = async () => {
      try {
        const response = await apiClient.get("/api/type_of_goals");
        if (response.data && Array.isArray(response.data)) {
          setGoalTypes(response.data);
        } else {
          setError("Некорректный формат данных типов голов");
        }
      } catch (error) {
        console.error("Ошибка при загрузке типов голов:", error);
        setError("Не удалось загрузить типы голов");
      }
    };

    fetchGoalTypes();
  }, []);

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

  const handleGoalSubmit = useCallback(async () => {
    if (!selectedTeamId || !selectedPlayerId || !goalTypeId) {
      toast.error("Пожалуйста, выберите все поля.");
      return;
    }

    setLoading(true);

    const goalData = {
      playerId: selectedPlayerId,
      gameId,
      teamId: selectedTeamId,
      vsTeamId: winnerTeamId === selectedTeamId ? loserTeamId : winnerTeamId,
      typeOfGoalId: goalTypeId,
    };
    try {
      if (selectedGoal) {
        await apiClient.patch(`/api/admin/goal/edit/${selectedGoal.goalId}`, goalData);
        toast.success("Гол обновлён успешно");
      } else {
        await apiClient.post("/api/admin/goal/add", goalData);
        toast.success("Гол добавлен успешно");
      }

      setMatches((prevMatches) => prevMatches.map((match) =>
        match.id === gameId ? { ...match, goals: [...match.goals, { playerId: selectedPlayerId }] } : match
      ));
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при добавлении/редактировании гола:", error);
      toast.error("Не удалось обработать гол");
    } finally {
      setLoading(false);
    }
  }, [gameId, selectedPlayerId, selectedTeamId, goalTypeId, selectedMatch, setMatches, onClose, selectedGoal]);

  const handleClose = () => {
    setSelectedTeamId(null);
    setSelectedPlayerId(null);
    setGoalTypeId(null);
    setPlayers([]); 
    onClose();
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Dialog open={open} onClose={handleClose}  maxWidth="sm" fullWidth>
      <DialogTitle>{selectedGoal ? "Редактировать гол" : "Добавить гол"}</DialogTitle>
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
          <InputLabel>Тип гола</InputLabel>
          <Select
            value={goalTypeId || ""}
            onChange={(e) => setGoalTypeId(Number(e.target.value))}
            label="Тип гола"
          >
            {goalTypes.length > 0 ? (
              goalTypes.map((goalType) => (
                <MenuItem key={goalType.id} value={goalType.id}>{goalType.name}</MenuItem>
              ))
            ) : (
              <MenuItem disabled>Нет типов голов</MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Отмена</Button>
        <Button onClick={handleGoalSubmit} color="primary" disabled={loading}>
          {selectedGoal ? "Сохранить изменения" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
