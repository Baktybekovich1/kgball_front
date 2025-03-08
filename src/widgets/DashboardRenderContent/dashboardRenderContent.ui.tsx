import { Box, Card, CardContent, Typography, CircularProgress, Button, Divider } from "@mui/material";
import defaultTeam from "~shared/assets/img/defaultTeam.webp";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";
import { useRef } from "react";

interface DashboardRenderContentProps {
  activeTab: string;
  loading: boolean;
  error: string;
  teams: any[];
  tournaments: any[];
  leagues: any[];
  selectedTeam: any;
  setSelectedTeam: (team: any) => void;
  setSelectedPlayerId: (player: any) => void;
  teamDetails: any;
  handleCreateTeamClick: () => void; 
  handleDeleteTeam: (id) => void; 
  handleEditTeam: (team: any) => void; 
  handleOpenPlayerDialog: () => void; 
  handleDeletePlayer: (playerId: string) => void; 
  setPlayerDetails: (player: any) => void;
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
  setSelectedPlayerId,
  teamDetails, 
  handleCreateTeamClick,
  handleDeleteTeam,
  handleOpenPlayerDialog,
  handleDeletePlayer,
  handleEditTeam,
  setPlayerDetails,
}) => {  

  const playersSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToPlayers = () => {
    if (playersSectionRef.current) {
      playersSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEditPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    const player = teamDetails?.players.find((p) => p.id === playerId); 
    setPlayerDetails(player);
    handleOpenPlayerDialog();
  };

  const handleAddPlayer = () => {
    setSelectedPlayerId(null);
    setPlayerDetails(null);
    handleOpenPlayerDialog();
  };

  const renderLoading = <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>;
  const renderError = <Typography color="error">{error}</Typography>;

  const renderCard = (item: any, onDelete: Function, onEdit: Function, isPlayer = false) => {
    const handleDelete = () => onDelete(item.id);
    const handleEdit = () => (isPlayer ? handleEditPlayer(item.id) : onEdit(item));
  
    return (
      <Card sx={{ height: "100%" }} key={item.id}>
        <CardContent className="flex bg-[#e1e1e1]">
          <div className="flex max-md:flex-col max-md:items-baseline items-center justify-between w-full gap-2">
            <div className="flex gap-2">
              <img
                src={isPlayer ? item.img || DefaultAvatar : item.logo || defaultTeam}
                alt={item.title || item.name}
                className="rounded-full shadow-lg h-20 w-20"
              />
              <div>
                <Typography variant="h6" fontWeight="bold">
                  {item.title || item.name} {item.surname}
                </Typography>
                {!isPlayer && (
                  <Button onClick={() => { setSelectedTeam(item); handleScrollToPlayers(); }} sx={{ mt: 2 }}>
                    Подробнее
                  </Button>
                )}
                {isPlayer && (
                  <Typography variant="body2" color="textSecondary">
                    {item.position}
                  </Typography>
                )}
              </div>
            </div>
            <div className="flex flex-col max-md:w-full gap-3">
              <Button
                onClick={handleDelete}
                sx={{ backgroundColor: "error.main", color: "white" }}
              >
                Удалить
              </Button>
              <Button
                onClick={handleEdit}
                sx={{ backgroundColor: "#ff9800", color: "white" }}
              >
                Редактировать
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "teams":
        if (loading) return renderLoading;
        if (error) return renderError;
        return (
          <Box>
            <div className="mb-4 flex justify-between items-center">
              <Typography variant="h5" fontWeight="bold">Список команд</Typography>
              <Button className="bg-tundora text-white text-base" onClick={handleCreateTeamClick}>Создать Команду</Button>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
              {teams.map((team) => renderCard(team, handleDeleteTeam, handleEditTeam))}
            </div>

            {selectedTeam && !teamDetails && renderLoading}

            {selectedTeam && teamDetails && (
              <Box ref={playersSectionRef} key={selectedTeam.id} sx={{ marginTop: 4 }}>
                <div className="flex items-center gap-2">
                  <img 
                    src={teamDetails.logo || defaultTeam} 
                    alt={teamDetails.title} 
                    className="rounded-full shadow-lg h-20 w-20" 
                  />
                  <Typography variant="h4" fontWeight="bold">{teamDetails.title}</Typography>
                </div>

                <Divider sx={{ marginBottom: 2 }} />
                <Button onClick={handleAddPlayer} sx={{ color: 'white', background: "gray", fontSize: '14px' }}>Добавить Игрока</Button>

                <Typography variant="h5" fontWeight="bold">Игроки:</Typography>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                  {teamDetails.players?.length > 0 ? teamDetails.players.map((player) => (
                    <li key={player.id} className="mt-4">
                      {renderCard(player, handleDeletePlayer, handleEditPlayer, true)}
                    </li>
                  )) : <Typography variant="body2">Нет игроков в команде</Typography>}
                </ul>
              </Box>
            )}
          </Box>
        );
      case "tournaments":
        if (loading) return renderLoading;
        if (error) return renderError;
        return (
          <Box>
            <div className="mb-4 flex justify-between items-center">
              <Typography variant="h5" fontWeight="bold">Список турниров</Typography>
              <Button className="bg-tundora text-white text-base">Добавить Турнир</Button>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
              {tournaments.map((tournament) => renderCard(tournament, () => {}, () => {}))}
            </div>
          </Box>
        );
      case "leagues":
        if (loading) return renderLoading;
        if (error) return renderError;
        return (
          <Box>
            <div className="mb-4 flex justify-between items-center">
              <Typography variant="h5" fontWeight="bold">Список лиг</Typography>
              <Button className="bg-tundora text-white text-base">Создать лигу</Button>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
              {leagues.map((league) => renderCard(league, () => {}, () => {}))}
            </div>
          </Box>
        );
      default:
        return null;
    }
  };

  return renderTabContent();
};
