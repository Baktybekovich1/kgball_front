import { Box, Card, CardContent, Typography, CircularProgress, Button, Divider } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import defaultTeam from "~shared/assets/img/defaultTeam.webp";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";

interface DashboardRenderContentProps {
  activeTab: string;
  loading: boolean;
  error: string;
  teams: any[];
  tournaments: any[];
  leagues: any[];
  selectedTeam: any;
  setSelectedTeam: (team: any) => void;
  teamDetails: any;
  teamError: string;
  handleCreateTeamClick: () => void; 
  handleDeleteTeam: (id) => void; 
  handleOpenAddPlayerDialog: () => void; 
  handleDeletePlayer: (playerId: string) => void; 
}

export const DashboardRenderContent: React.FC<DashboardRenderContentProps> = ({
  activeTab, 
  loading, 
  error, 
  teams, 
  tournaments,  
  leagues, 
  selectedTeam, 
  setSelectedTeam, 
  teamDetails, 
  teamError ,
  handleCreateTeamClick,
  handleDeleteTeam,
  handleOpenAddPlayerDialog,
  handleDeletePlayer,
}) => {
  switch (activeTab) {
    case "teams":
      if (loading) return <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>;
      if (error) return <Typography color="error">{error}</Typography>;
      return (
        <Box>
          <div className="mb-4 flex max-md:flex-col items-center justify-between">
            <Typography variant="h5" fontWeight="bold">Список команд</Typography>
            <Button className="bg-tundora text-white text-base" onClick={handleCreateTeamClick}>Создать Команду</Button>
          </div>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
            {teams.map((team) => (
              <Card sx={{ height: "100%" }} key={team.id}>
                <CardContent className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src={team.logo || defaultTeam} 
                      alt={team.title} 
                      className="rounded-full shadow-lg h-20 w-20" 
                      />
                    <div>
                      <Typography variant="h6" fontWeight="bold">
                        {team.title}
                      </Typography>
                      <Button onClick={() => setSelectedTeam(team)} sx={{ mt: 2 }}>
                        Подробнее
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <Button
                      onClick={() => handleDeleteTeam(team.id)}
                      sx={{
                        backgroundColor: "error.main",
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "error.dark",
                        },
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))} 
          </div>

          {selectedTeam && teamDetails === null && (
            <Typography className="flex justify-center items-center h-64">
              <CircularProgress />
            </Typography>
          )}

          {selectedTeam && teamDetails && (
            <Box sx={{ marginTop: 4 }}>
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
                onClick={handleOpenAddPlayerDialog}
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

              <Typography style={{ marginBottom: '10px' }} variant="h5" fontWeight="bold">Игроки:</Typography>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {teamDetails.players && teamDetails.players.length > 0 ? (
                  teamDetails.players.map((player: any, index: number) => (
                    <li key={index} className="flex items-center justify-between" style={{ marginBottom: "10px", padding: "10px", borderRadius: "8px", backgroundColor: "#f5f5f5", transition: "background-color 0.3s" }}>
                      <div className="flex items-center gap-2">
                        <img 
                          src={player.img || DefaultAvatar} 
                          alt={player.name} 
                          className="max-md:w-14 max-md:h-14 w-20 h-20 rounded-full border border-gray-400 object-cover"
                        />
                        <div className="flex flex-col">
                          <Typography className="max-md:text-base text-xl font-semibold text-gray-900">
                            {player.name} {player.surname}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" className="text-gray-600">
                            {player.position}
                          </Typography>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDeletePlayer(player.id)}
                        sx={{
                          backgroundColor: "error.main",
                          color: "white",
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "error.dark",
                          },
                        }}
                      >
                        Удалить
                      </Button>
                    </li>
                  ))
                ) : (
                  <Typography variant="body2">Нет игроков в команде</Typography>
                )}
              </ul>
            </Box>
          )}
        </Box>
      );

    case "tournaments":
      if (loading) return <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>;
      if (error) return <Typography color="error">{error}</Typography>;
      return (
        <Box>
          <div className="mb-4 flex max-md:flex-col items-center justify-between">
            <Typography variant="h5" fontWeight="bold">Список турниров</Typography>
            <Button className="bg-tundora text-white text-base">Добавить Турнир</Button> 
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
      if (loading) return <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>;
      if (error) return <Typography color="error">{error}</Typography>;
      return (
        <Box>
          <div className="mb-4 flex max-md:flex-col items-center justify-between">
            <Typography variant="h5" fontWeight="bold">Список лиг</Typography>
            <Button className="bg-tundora text-white text-base">Создать лигу</Button>
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
