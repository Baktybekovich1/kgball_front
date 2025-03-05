import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { DashboardRenderContent } from "~widgets/DashboardRenderContent";

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

  const handleCreateTeamClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(event.target.files[0]);
    }
  };

  const handleSubmitTeam = () => {
    if (title) {
      const formData = new FormData();
      formData.append("title", title);
      if (logo) {
        formData.append("logo", logo); 
      }
      apiClient.post("/api/admin/team/add", formData)
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
 
  useEffect(() => {
    if (selectedTeam) {
      apiClient.get(`/api/teams/${selectedTeam.id}`)
        .then((response) => {
          if (response.data && typeof response.data === "object") {
            const team = response.data;
            Promise.all([
              ...team.players.map((url: string) => apiClient.get(url)),
              ...team.goals.map((url: string) => apiClient.get(url)),
              ...team.assists.map((url: string) => apiClient.get(url)),
            ])
              .then((responses) => {
                const players = responses.slice(0, team.players.length);
                const goals = responses.slice(team.players.length, team.players.length + team.goals.length);
                const assists = responses.slice(team.players.length + team.goals.length, team.players.length + team.goals.length + team.assists.length);

                setTeamDetails({
                  ...team,
                  players: players.map(player => player.data),
                  goals: goals.map(goal => goal.data),
                  assists: assists.map(assist => assist.data),
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
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Создать команду</DialogTitle>
        <DialogContent>
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
    </Box>
  );
};

export default DashboardContent;
