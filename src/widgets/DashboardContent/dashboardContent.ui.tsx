import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { DashboardRenderContent } from "~widgets/DashboardRenderContent";
import { AddPlayerDialog } from "~widgets/AddPlayer";

interface DashboardContentProps {
  activeTab: string;
  loading: boolean;
  error: string;
  teams: any[];
  tournaments: any[];
  leagues: any[];
  setTeams: React.Dispatch<React.SetStateAction<any[]>>; 
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab, loading, error, teams, tournaments, leagues, setTeams }) => {
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teamDetails, setTeamDetails] = useState<any>(null);
  const [teamError, setTeamError] = useState("");
  const [openDialog, setOpenDialog] = useState(false); 
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  const [openAddPlayerDialog, setOpenAddPlayerDialog] = useState(false);
  const handleOpenAddPlayerDialog = () => setOpenAddPlayerDialog(true);
  const handleCloseAddPlayerDialog = () => setOpenAddPlayerDialog(false);

  const handleCreateTeamClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogo(file);
      setPreviewLogo(URL.createObjectURL(file));
  
      // Конвертируем изображение в base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setLogo(reader.result);
      };
    }
  };
  
  const handleSubmitTeam = () => {
    if (title) {
      const formData = new FormData();
      formData.append("title", title);
      if (logo) {
        formData.append("logo", logo); 
      }
  
      apiClient.post("/api/admin/team/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          const newTeam = response.data; 
          setTeams((prevTeams) => [...prevTeams, newTeam]); 
          setOpenDialog(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Ошибка при добавлении команды:", error);
        });
    } else {
      alert("Пожалуйста, заполните все поля!");
    }
  };

  const handleDeleteTeam = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту команду?")) {
      apiClient.delete(`/api/admin/team/remove/${id}`)
        .then(() => {
          setTeams((prevTeams) => prevTeams.filter((team) => team.id !== id));
          alert("Команда удалена успешно");
        })
        .catch((error) => {
          console.error("Ошибка при удалении команды:", error);
          alert("Не удалось удалить команду");
        });
    }
  };


  const handleDeletePlayer = (playerId: string) => {
    apiClient.delete(`/api/admin/player/remove/${playerId}`)
      .then((response) => {
        setTeamDetails((prevDetails) => ({
          ...prevDetails,
          players: prevDetails.players.filter(player => player.id !== playerId),
        }));
      })
      .catch((error) => {
        console.error("Ошибка при удалении игрока:", error);
        alert("Не удалось удалить игрока");
      });
  };
 
  useEffect(() => {
    if (selectedTeam) {
      apiClient.get(`/api/teams/${selectedTeam.id}`)
        .then((response) => {
          if (response.data && typeof response.data === "object") {
            const team = response.data;
            Promise.all([
              ...team.players.map((url: string) => apiClient.get(url)),
            ])
              .then((responses) => {
                const players = responses.slice(0, team.players.length);

                setTeamDetails({
                  ...team,
                  players: players.map(player => player.data),
                });
              })
              .catch(() => {
                setTeamError("Ошибка загрузки дополнительных данных");
              });
          } else {
            setTeamError("Неверный формат данных от сервера");
          }
        })
        .catch(() => setTeamError("Ошибка загрузки данных команды"));
    }
  }, [selectedTeam]);

  return (
    <Box>
      <DashboardRenderContent
        activeTab={activeTab}
        loading={loading}
        error={error}
        teams={teams}
        tournaments={tournaments}
        leagues={leagues}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        teamDetails={teamDetails}
        teamError={teamError}
        handleCreateTeamClick={handleCreateTeamClick}
        handleDeleteTeam={handleDeleteTeam} 
        handleOpenAddPlayerDialog={handleOpenAddPlayerDialog}
        handleDeletePlayer={handleDeletePlayer}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Создать команду</DialogTitle>
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
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          style={{ marginBottom: 2 }}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmitTeam}>Создать</Button>
        </DialogActions>
      </Dialog>
      <AddPlayerDialog open={openAddPlayerDialog} onClose={handleCloseAddPlayerDialog} teamId={selectedTeam?.id} setTeamDetails={setTeamDetails}/>
  </Box>
  );
};

export default DashboardContent;
