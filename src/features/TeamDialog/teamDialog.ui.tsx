import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TeamDialogProps {
  open: boolean;
  onClose: () => void;
  selectedTeam: any | null;
  setTeams: React.Dispatch<React.SetStateAction<any[]>>;
}

export const TeamDialog: React.FC<TeamDialogProps> = ({ open, onClose, selectedTeam, setTeams }) => {
  const [title, setTitle] = useState<string>(selectedTeam ? selectedTeam.title : "");
  const [logo, setLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(selectedTeam ? selectedTeam.logo : "");

  useEffect(() => {
    if (selectedTeam) {
      setTitle(selectedTeam.title);
      setPreviewLogo(selectedTeam.logo);
      setLogo(selectedTeam.logo); 
    } else {
      setTitle("");
      setPreviewLogo(""); 
      setLogo(null);
    }
  }, [selectedTeam]);
  

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogo(file);
      setPreviewLogo(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
    }
  };

  const handleSubmit = () => {
    if (title) {
      const requestBody = {
        id: selectedTeam ? selectedTeam.id : 0,
        title: title,
        logo: logo as string, 
      };

      const request = selectedTeam
        ? apiClient.patch(`/api/admin/team/edit/${selectedTeam.id}`, requestBody)
        : apiClient.post("/api/admin/team/add", requestBody);

        request
        .then(() => {
          const newTeam = {
            id: selectedTeam ? selectedTeam.id : Math.random(), 
            title,
            logo: logo as string,
          };
          
          setTeams((prevTeams) => {
            if (selectedTeam) {
              return prevTeams.map((team) => (team.id === newTeam.id ? newTeam : team));
            } else {
              return [...prevTeams, newTeam];
            }
          });
      
          toast.success(selectedTeam ? "Команда редактирована успешно" : "Команда добавлена успешно");
          onClose();
          window.location.reload();
        })
        .catch((error) => {
          toast.error(selectedTeam ? "Не удалось обновить команду" : "Не удалось добавить команду");
          console.error("Ошибка при сохранении команды:", error);
        });
    } else {
      toast.error("Пожалуйста, заполните все поля!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{selectedTeam ? "Редактировать команду" : "Создать команду"}</DialogTitle>
      <DialogContent>
        {previewLogo && (
          <img
            src={previewLogo}
            alt="Предпросмотр логотипа"
            style={{ width: 100, height: 100, objectFit: "cover", marginBottom: 10, borderRadius: "8px" }}
          />
        )}
        <TextField
          label="Название команды"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <input type="file" accept="image/*" onChange={handleLogoChange} style={{ marginBottom: 2 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};
