import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";
import { apiClient } from "~shared/lib/api";
import { toast } from "react-toastify";

interface AddTourneyPrizeProps {
  open: boolean;
  onClose: () => void;
  tourneyId: number;
  teams: any[];
}

export const AddTourneyPrize: React.FC<AddTourneyPrizeProps> = ({ open, onClose, tourneyId, teams }) => {
  const [firstPositionId, setFirstPositionId] = useState<number | null>(null);
  const [secondPositionId, setSecondPositionId] = useState<number | null>(null);
  const [thirdPositionId, setThirdPositionId] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!firstPositionId || !secondPositionId || !thirdPositionId) {
      toast.error("Заполните все призовые места");
      return;
    }
    if (new Set([firstPositionId, secondPositionId, thirdPositionId]).size !== 3) {
      toast.error("Команды на призовых местах должны быть разными");
      return;
    }

    try {
      await apiClient.post("/api/admin/tourney/prizes/add", {
        tourneyId,
        firstPositionId,
        secondPositionId,
        thirdPositionId,
      });
      toast.success("Призы добавлены успешно");
      onClose();
    } catch (error: any) {
      console.error("Ошибка при добавлении призов:", error);
    
      if (error.response?.status === 500) {
        toast.error("Призовые места уже назначены или возникла ошибка на сервере");
      } else {
        toast.error("Не удалось добавить призы");
      }
    }
  };
 
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Назначить Призы Турнира</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Первое место</InputLabel>
          <Select
            value={firstPositionId || ""}
            onChange={(e) => setFirstPositionId(e.target.value as number)}
            label="Первое место"
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel>Второе место</InputLabel>
          <Select
            value={secondPositionId || ""}
            onChange={(e) => setSecondPositionId(e.target.value as number)}
            label="Второе место"
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel>Третье место</InputLabel>
          <Select
            value={thirdPositionId || ""}
            onChange={(e) => setThirdPositionId(e.target.value as number)}
            label="Третье место"
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Отмена</Button>
        <Button onClick={handleSubmit} color="primary">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};
