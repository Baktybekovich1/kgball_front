import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TourneyDialogProps {
  open: boolean;
  onClose: () => void;
  selectedTourney: any | null;
  setTourneys: React.Dispatch<React.SetStateAction<any[]>>;
}

export const TourneyDialog: React.FC<TourneyDialogProps> = ({ open, onClose, selectedTourney, setTourneys }) => {
  const [title, setTitle] = useState<string>("");
  const [teamsSum, setTeamsSum] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (selectedTourney) {
      setTitle(selectedTourney.title);
      setTeamsSum(selectedTourney.teams_sum);
  
      // Преобразование даты
      const rawDate = selectedTourney.date;
      const formattedDate = /^\d{2}\.\d{2}\.\d{4}$/.test(rawDate)
        ? rawDate.split('.').reverse().join('-') // dd.MM.yyyy -> yyyy-MM-dd
        : rawDate;
  
      setDate(formattedDate);
      setYear(selectedTourney.year);
    } else {
      setTitle("");
      setTeamsSum(0);
      setDate("");
      setYear(new Date().getFullYear());
    }
  }, [selectedTourney]);
  

  const handleSubmit = () => {
    if (!title || !date || !year || teamsSum < 0) {
      toast.error("Пожалуйста, заполните все поля!");
      return;
    }

    const requestBody = selectedTourney
    ? {
        id: selectedTourney.id,
        title,
        teams_sum: teamsSum,
        date,
        year,
      }
    : {
        title,
        teams_sum: teamsSum,
        date,
        year,
      };

    const request = selectedTourney
      ? apiClient.patch(`/api/admin/tourney/edit/${selectedTourney.id}`, requestBody) 
      : apiClient.post("/api/admin/tourney/add", requestBody);

    request
      .then(() => {
        const newTourney = {
          id: selectedTourney ? selectedTourney.id : Math.random(),
          title,
          teams_sum: teamsSum,
          date,
          year,
        };

        setTourneys((prevTourneys) => {
          const updatedTourneys = prevTourneys ? prevTourneys : [];
        
          if (selectedTourney) {
            return updatedTourneys.map((t) => (t.id === newTourney.id ? newTourney : t));
          } else {
            return [...updatedTourneys, newTourney];
          }
        });
        
        
        toast.success(selectedTourney ? "Турнир успешно обновлён" : "Турнир успешно добавлен");
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        toast.error(selectedTourney ? "Ошибка при обновлении турнира" : "Ошибка при добавлении турнира");
        console.log("Sending request body:", requestBody);
        console.error("Ошибка:", error.response?.data || error.message);

        // console.error("Ошибка:", error);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{selectedTourney ? "Редактировать турнир" : "Создать турнир"}</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <TextField
          label="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Количество команд"
          type="number"
          value={teamsSum}
          onChange={(e) => setTeamsSum(Number(e.target.value))}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Дата"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Год"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};
