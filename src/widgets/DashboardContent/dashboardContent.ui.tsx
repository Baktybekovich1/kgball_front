import { Box, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, Button, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import defaultTeam from "~shared/assets/img/defaultTeam.webp";

interface DashboardContentProps {
  activeTab: string;
  loading: boolean;
  error: string;
  teams: any[];
  tournaments: any[];
  leagues: any[];
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab, loading, error, teams, tournaments, leagues }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teamDetails, setTeamDetails] = useState<any>(null);
  const [teamError, setTeamError] = useState("");

  const handleOpenModal = (team: any) => {
    setSelectedTeam(team);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTeam(null);
    setTeamDetails(null);
    setTeamError("");
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
              .catch((error) => {
                setTeamError("Ошибка загрузки дополнительных данных");
              });
          } else {
            setTeamError("Неверный формат данных от сервера");
          }
        })
        .catch(() => setTeamError("Ошибка загрузки данных команды"));
    }
  }, [selectedTeam]);

  const renderContent = () => {
    switch (activeTab) {
      case "teams":
        if (loading) return <Typography>Загрузка...</Typography>;
        if (error) return <Typography color="error">{error}</Typography>;
        return (
          <Box>
            <div className="mb-4 flex max-md:flex-col items-center justify-between">
              <Typography variant="h5" fontWeight="bold">Список команд</Typography>
              <Button
              className="bg-tundora text-white text-base">
                Создать Команду
              </Button>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
              {teams.map((team) => (
                <Card sx={{ height: "100%" }} key={team.id}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{team.title}</Typography>
                    <Button onClick={() => handleOpenModal(team)} sx={{ mt: 2 }}>
                      Подробнее
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Box>
        );
      case "tournaments":
        if (loading) return <Typography>Загрузка...</Typography>;
        if (error) return <Typography color="error">{error}</Typography>;
        return (
          <Box>
            <div className="mb-4 flex max-md:flex-col items-center justify-between">
              <Typography variant="h5" fontWeight="bold">Список турниров</Typography>
              <Button
              className="bg-tundora text-white text-base">
                Добавить Турнир
              </Button>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
              {tournaments.map((tournament) => (
                <Card sx={{ height: "100%" }} key={tournament.id}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{tournament.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Дата:</strong> {tournament.date}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Box>
        );
      case "leagues":
        if (loading) return <Typography>Загрузка...</Typography>;
        if (error) return <Typography color="error">{error}</Typography>;
        return (
          <Box>
            <div className="mb-4 flex max-md:flex-col items-center justify-between">
              <Typography variant="h5" fontWeight="bold">Список лиг</Typography>
              <Button
              className="bg-tundora text-white text-base">
                Создать лигу
              </Button>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
              {leagues.map((league) => (
                <Card sx={{ height: "100%" }} key={league.id}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{league.title}</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      {renderContent()}
      
      <Dialog open={openModal} onClose={handleCloseModal} fullScreen sx={{ padding: 3 }}>
        <DialogActions sx={{ justifyContent: "flex-start" }}>
          <Button onClick={handleCloseModal} color="primary">
            Закрыть
          </Button>
        </DialogActions>
        <DialogContent sx={{ padding: 3 }}>
          {teamError && <Typography color="error" sx={{ marginBottom: 2 }}>{teamError}</Typography>}
          {teamDetails ? (
            <Box>
              <div style={{ gap: '4px', display: 'flex', alignItems: 'center' }}>
                <img 
                  src={teamDetails.logo || defaultTeam} 
                  alt={teamDetails.title} 
                  className="rounded-full shadow-lg" 
                  style={{ width: '50px', height: '50px' }} 
                />
                <Typography variant="h4" fontWeight="bold">
                  {teamDetails.title}
                </Typography>
              </div>

              <Divider sx={{ marginBottom: 2 }} />
            
              <Button
                sx={{
                  color: 'white', 
                  background: "gray",
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  marginBottom: '5px',
                  '&:hover': {
                    cursor: 'pointer',
                  }
                }}
                >
                Добавить Игрока
              </Button>
              <Typography variant="h5" fontWeight="bold">Игроки:</Typography>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {teamDetails.players.map((player: any, index: number) => (
                  <li key={index} style={{ marginBottom: "10px", padding: "10px", borderRadius: "8px", backgroundColor: "#f5f5f5", transition: "background-color 0.3s" }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
                      {player.name} {player.surname} - {player.position}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          ) : (
            <Typography>Загрузка...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DashboardContent;
