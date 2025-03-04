import { Box, Card, CardContent, Typography, CircularProgress, Button, Divider } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import defaultTeam from "~shared/assets/img/defaultTeam.webp";

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
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{team.title}</Typography>
                  <Button onClick={() => setSelectedTeam(team)} sx={{ mt: 2 }}>
                    Подробнее
                  </Button>
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

              <Typography style={{marginBottom: '10px'}} variant="h5" fontWeight="bold">Игроки:</Typography>
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
