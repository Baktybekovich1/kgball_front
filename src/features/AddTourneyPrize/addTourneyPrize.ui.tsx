import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, FormControl, InputLabel, Typography } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import { toast } from "react-toastify";

interface AddTourneyPrizeProps {
  open: boolean;
  onClose: () => void;
  tourneyId: number;
  teams: any[];
  selectedPrize: any;  
}

export const AddTourneyPrize: React.FC<AddTourneyPrizeProps> = ({ open, onClose, tourneyId, teams, selectedPrize }) => {
  const [firstPositionId, setFirstPositionId] = useState<number | null>(null);
  const [secondPositionId, setSecondPositionId] = useState<number | null>(null);
  const [thirdPositionId, setThirdPositionId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedPrize) {
      setFirstPositionId(selectedPrize.firstPositionId);
      setSecondPositionId(selectedPrize.secondPositionId);
      setThirdPositionId(selectedPrize.thirdPositionId);
    }
  }, [selectedPrize]);

  const handleSubmit = useCallback(async () => {
    if (!firstPositionId || !secondPositionId || !thirdPositionId) {
      toast.error("Заполните все призовые места");
      return;
    }
    if (new Set([firstPositionId, secondPositionId, thirdPositionId]).size !== 3) {
      toast.error("Команды на призовых местах должны быть разными");
      return;
    }

    setLoading(true);

    try {
      const prizeData = {
        tourneyId,
        firstPositionId,
        secondPositionId,
        thirdPositionId,
      };

      if (selectedPrize) {
        await apiClient.patch(`/api/admin/tourney/prizes/edit/${selectedPrize.prizesId}`, prizeData);
        toast.success("Призы обновлены успешно");
      } else {
        await apiClient.post("/api/admin/tourney/prizes/add", prizeData);
        toast.success("Призы добавлены успешно");
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при добавлении/редактировании призов:", error);
      toast.error("Не удалось обработать призы");
    } finally {
      setLoading(false);
    }
  }, [firstPositionId, secondPositionId, thirdPositionId, tourneyId, selectedPrize, onClose]);

  const handleClose = () => {
    setFirstPositionId(null);
    setSecondPositionId(null);
    setThirdPositionId(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedPrize ? "Редактировать Призы" : "Назначить Призы"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Первое место</InputLabel>
          <Select
            value={firstPositionId || ""}
            onChange={(e) => setFirstPositionId(Number(e.target.value))}
            label="Первое место"
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>{team.title}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Второе место</InputLabel>
          <Select
            value={secondPositionId || ""}
            onChange={(e) => setSecondPositionId(Number(e.target.value))}
            label="Второе место"
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>{team.title}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Третье место</InputLabel>
          <Select
            value={thirdPositionId || ""}
            onChange={(e) => setThirdPositionId(Number(e.target.value))}
            label="Третье место"
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>{team.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Отмена</Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {selectedPrize ? "Сохранить изменения" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
