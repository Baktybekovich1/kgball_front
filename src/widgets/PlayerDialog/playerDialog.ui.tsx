import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PlayerDialogProps {
  open: boolean;
  onClose: () => void;
  teamId: string | undefined; 
  setTeamDetails: React.Dispatch<React.SetStateAction<any>>;
  playerId: string; 
  playerDetails: any; 
}

export const PlayerDialog: React.FC<PlayerDialogProps> = ({ open, onClose, teamId, setTeamDetails, playerId, playerDetails }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [position, setPosition] = useState("");
  const [birthday, setBirthday] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const componentRef = useRef<any>();

  useEffect(() => {
    if (playerId && playerDetails) {
      setName(playerDetails.name);
      setSurname(playerDetails.surname);
      setPosition(playerDetails.position);
      setBirthday(playerDetails.birthday);
      setPreviewImg(playerDetails.img || "");
      setImg(playerDetails.img || "");
    }
  }, [playerId, playerDetails]);

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
  
  const handleAddOrEditPlayer = () => {
    if (!name || !surname || !position || !birthday || !teamId) {
      toast.error("Пожалуйста, заполните все поля!");
      return;
    }
  
    const requestBody = {
      playerId: playerId || 0,
      teamId,
      name,
      surname,
      position,
      birthday,
      img: img || "",
    };
  
    const apiRequest = playerId
      ? apiClient.patch(`/api/admin/player/edit`, requestBody)
      : apiClient.post("/api/admin/player/add", requestBody);
  
    apiRequest
      .then((response) => {
        setTeamDetails((prevDetails) => ({
          ...prevDetails,
          players: playerId
            ? prevDetails.players.map((player) =>
                player.id === playerId ? response.data : player
              )
            : [...prevDetails.players, response.data],
        }));
  
        toast.success(playerId ? "Игрок редактирован успешно" : "Игрок добавлен успешно");
        handleDialogClose();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Ошибка при сохранении игрока:", error);
        toast.error(playerId ? "Не удалось редактировать игрока" : "Не удалось добавить игрока");
      });
  };
   
  
  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>{playerId ? "Редактировать игрока" : "Добавить игрока"}</DialogTitle>
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
        <Button onClick={handleAddOrEditPlayer}>{playerId ? "Редактировать" : "Добавить"}</Button>
      </DialogActions>
    </Dialog>
  );
};
