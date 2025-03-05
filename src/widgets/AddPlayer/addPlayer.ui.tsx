import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import { useState, useRef } from "react";

interface AddPlayerDialogProps {
  open: boolean;
  onClose: () => void;
  teamId: string | undefined; 
  setTeamDetails: React.Dispatch<React.SetStateAction<any>>;
}



export const AddPlayerDialog: React.FC<AddPlayerDialogProps> = ({ open, onClose, teamId, setTeamDetails }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [position, setPosition] = useState("");
  const [birthday, setBirthday] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const componentRef = useRef<any>();

  const handleDialogClose = () => {
    setName("");
    setSurname("");
    setPosition("");
    setBirthday("");
    setImg(null);
    setPreviewImg(null);
    onClose();
  };

  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
  
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImg(base64Image); // сохраняем base64 строку изображения
        setPreviewImg(base64Image); // создаем превью изображения
      };
      reader.readAsDataURL(file); // преобразуем файл в base64
    }
  };
  
  
  const handleAddPlayer = () => {
    if (!name || !surname || !position || !birthday || !teamId) {
      alert("Пожалуйста, заполните все поля!");
      return;
    }
  
    const formData = new FormData();
    formData.append("teamId", teamId);  
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("position", position);
    formData.append("birthday", birthday);
  
    if (img) {
      formData.append("img", img); 
    } else {
      formData.append("img", "");
    }
  
    apiClient.post("/api/admin/player/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        setTeamDetails((prevDetails) => ({
          ...prevDetails,
          players: [...prevDetails.players, response.data],
        }));
        handleDialogClose(); 
  
        if (componentRef.current) {
          componentRef.current.forceUpdate();
        }
        window.location.reload();
      })
      .catch((error) => {
        console.error("Ошибка при добавлении игрока:", error);
        alert("Не удалось добавить игрока");
      });
  };  
  
  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>Добавить игрока</DialogTitle>
      <DialogContent>
        {previewImg && <img src={previewImg} alt="Предпросмотр" style={{ width: 100, height: 100, objectFit: "cover" }} />}
        <TextField label="Имя" fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={{ marginBottom: 2 }} />
        <TextField label="Фамилия" fullWidth value={surname} onChange={(e) => setSurname(e.target.value)} sx={{ marginBottom: 2 }} />
        <TextField label="Позиция" fullWidth value={position} onChange={(e) => setPosition(e.target.value)} sx={{ marginBottom: 2 }} />
        <TextField label="Дата рождения" type="date" fullWidth value={birthday} onChange={(e) => setBirthday(e.target.value)} sx={{ marginBottom: 2 }} InputLabelProps={{ shrink: true }} />
        <input type="file" accept="image/*" onChange={handleImgChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Отмена</Button>
        <Button onClick={handleAddPlayer}>Добавить</Button>
      </DialogActions>
    </Dialog>
  );
};
