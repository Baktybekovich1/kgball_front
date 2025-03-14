import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, FormControl, InputLabel, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { apiClient } from "~shared/lib/api";
import { toast } from "react-toastify";

interface MatchDialogProps {
  open: boolean;
  onClose: () => void;
  selectedMatch: any | null;
  setMatches: React.Dispatch<React.SetStateAction<any[]>>;
  tourneyId: number;
  teams: any[];
}

export const MatchDialog: React.FC<MatchDialogProps> = ({ open, onClose, selectedMatch, setMatches, tourneyId, teams }) => {
  const [winnerTeamId, setWinnerTeamId] = useState<number>(0);
  const [loserTeamId, setLoserTeamId] = useState<number>(0);

  useEffect(() => {
    if (selectedMatch) {
      setWinnerTeamId(selectedMatch.winnerTeamId);
      setLoserTeamId(selectedMatch.loserTeamId);
    } else {
      setWinnerTeamId(0);
      setLoserTeamId(0);
    }
  }, [selectedMatch]);

  const handleSubmit = () => {
    if (!winnerTeamId || !loserTeamId || winnerTeamId === loserTeamId) {
      toast.error("Выберите две разные команды.");
      return;
    }

    const requestBody = {
      tourneyId,
      winnerTeamId,
      loserTeamId,
    };

    const request = selectedMatch
      ? apiClient.patch(`/api/admin/game/edit/${selectedMatch.gameId}`, requestBody)
      : apiClient.post("/api/admin/game/add", requestBody);

    request
      .then(() => {
        toast.success(selectedMatch ? "Матч обновлён" : "Матч добавлен");

        // Обновим список матчей в родительском компоненте
        setMatches((prev) => {
          if (selectedMatch) {
            return prev.map((match) =>
              match.gameId === selectedMatch.gameId
                ? { ...match, ...requestBody }
                : match
            );
          } else {
            return [...prev, { gameId: Math.random(), ...requestBody }];
          }
        });
        onClose();
        window.location.reload();
      })
      .catch((err) => {
        toast.error("Ошибка при сохранении матча");
        console.error(err);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
        {selectedMatch ? "Редактировать матч" : "Добавить матч"}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
      <FormControl style={{ marginTop: '10px' }} fullWidth>
        <InputLabel>Победитель</InputLabel>
          <Select
            value={winnerTeamId}
            onChange={(e) => setWinnerTeamId(Number(e.target.value))}
            label="Победитель"
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Проигравший</InputLabel>
          <Select
            value={loserTeamId}
            onChange={(e) => setLoserTeamId(Number(e.target.value))}
            label="Проигравший"
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <Divider sx={{ my: 2 }} />
      <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary" sx={{ minWidth: 120 }}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ minWidth: 120 }}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
