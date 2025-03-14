import { Box, Card, CardContent, Typography, CircularProgress, Button, Divider } from "@mui/material";
import defaultTeam from "~shared/assets/img/defaultTeam.webp";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";
import { useRef, useState } from "react";

interface DashboardRenderContentProps {
  activeTab: string;
  loading: boolean;
  error: string;
  teams: any[];
  matches: any[];
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
  handleOpenTournamentClick: () => void; 
  setSelectedTourney: (tourney: any) => void;
  handleDeleteTourney: (id) => void; 
  setActiveTab: (tab: string) => void; 
  setOpenPrizeDialog: (boolean) => void; 
  setSelectedTourneyId: (id) => void; 
  selectedTourneyId: any;
  setOpenMatchDialog: (boolean) => void; 
  setSelectedMatch: (id) => void; 
  handleDeleteMatch: (id) => void; 
  goals: any[];
}

export const DashboardRenderContent: React.FC<DashboardRenderContentProps> = ({
  activeTab, loading, error, teams, matches, tournaments, leagues, 
  selectedTeam, setSelectedTeam, setSelectedPlayerId, teamDetails, 
  handleCreateTeamClick, handleDeleteTeam, handleOpenPlayerDialog, 
  handleDeletePlayer, handleEditTeam, setPlayerDetails, handleOpenTournamentClick, 
  setSelectedTourney, handleDeleteTourney, setActiveTab, setOpenPrizeDialog, 
  setSelectedTourneyId, selectedTourneyId, setOpenMatchDialog, setSelectedMatch, 
  handleDeleteMatch, goals,
}) => {  
  const playersSectionRef = useRef<HTMLDivElement>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const handleScrollToPlayers = () => playersSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleEditPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setPlayerDetails(teamDetails?.players.find(p => p.id === playerId));
    handleOpenPlayerDialog();
  };

  const handleAddPlayer = () => {
    setSelectedPlayerId(null);
    setPlayerDetails(null);
    handleOpenPlayerDialog();
  };

  const handleEditTourney = (tourney: any) => {
    setSelectedTourney(tourney);
    handleOpenTournamentClick();
  };

  const handleAddTourney = () => {
    setSelectedTourney(null);
    handleOpenTournamentClick();
  };

  const handleOpenPrizeDialog = (tourneyId: number) => {
    setSelectedTourneyId(tourneyId);
    setOpenPrizeDialog(true);
  };

  const handleAddPrize = (tourneyId: number) => {
    handleOpenPrizeDialog(tourneyId);
  };

  const handleAddMatch = () => {
    setSelectedMatch(null); 
    setOpenMatchDialog(true);
  };

  const handleEditMatch = (match: any) => {
    setSelectedMatch(match); 
    setOpenMatchDialog(true);
  };

  const toggleMatchDetails = (matchId: string) => setExpandedMatchId(prevId => (prevId === matchId ? null : matchId));

  const renderLoading = <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>;
  const renderError = <Typography color="error">{error}</Typography>;

  const renderCard = (item: any, onDelete: Function, onEdit: Function, isPlayer = false, isMatch = false) => {
    const handleDelete = () => {
      if (isMatch) {
        onDelete(item.gameId); 
      } else {
        onDelete(item.id);
      }
    };

    const handleEdit = () => isPlayer ? handleEditPlayer(item.id) : onEdit(item);
    const handleDetailsClick = () => {
      if (!isPlayer && !isMatch) {
        item.players ? setSelectedTeam(item) : setSelectedTourney(item);
        item.players ? handleScrollToPlayers() : setSelectedTourneyId(item.id);
        !item.players && setActiveTab("matches");
      }
    };

    return (
      <Card sx={{ height: "100%" }} key={item.id || `${item.name}-${item.title}-${item.surname}`}>
        <CardContent className="flex bg-[#e1e1e1]">
          {isMatch ? (
            <div className="flex flex-col gap-2 w-full">
              <Box className="flex items-center justify-between">
                <Typography className="font-semibold">{item.loserTeamTitle}</Typography>
                <div className="flex gap-4 text-md font-semibold">
                  <span>{item.loserTeamScore}</span>
                  <span>VS</span>
                  <span>{item.winnerTeamScore}</span>
                </div>
                <Typography className="font-semibold">{item.winnerTeamTitle}</Typography>
              </Box>
              <div className="flex flex-col max-md:w-full mt-2 gap-3">
                <Button onClick={() => toggleMatchDetails(item.gameId)} sx={{ backgroundColor: "blue", color: "white" }}>
                  Подробнее
                </Button>
                <Button onClick={handleDelete} sx={{ backgroundColor: "error.main", color: "white" }}>Удалить</Button>
                <Button onClick={handleEdit} sx={{ backgroundColor: "#ff9800", color: "white" }}>Редактировать</Button>
              </div>
            </div>
          ) : (
            <div className="flex max-md:flex-col max-md:items-baseline items-center justify-between w-full gap-2">
              <div className="flex gap-2">
                <img src={isPlayer ? item.img || DefaultAvatar : item.logo || defaultTeam} alt={item.title || item.name} className="rounded-full shadow-lg h-20 w-20" />
                <div>
                  <Typography variant="h6" fontWeight="bold">{item.title || item.name} {item.surname}</Typography>
                  {!isPlayer && <Button onClick={handleDetailsClick} sx={{ mt: 2 }}>Подробнее</Button>}
                  {isPlayer && <Typography variant="body2" color="textSecondary">{item.position}</Typography>}
                </div>
              </div>
              <div className="flex flex-col max-md:w-full gap-3">
                <Button onClick={handleDelete} sx={{ backgroundColor: "error.main", color: "white" }}>Удалить</Button>
                <Button onClick={handleEdit} sx={{ backgroundColor: "#ff9800", color: "white" }}>Редактировать</Button>
              </div>
            </div>
          )}
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
              {teams.map(team => renderCard(team, handleDeleteTeam, handleEditTeam))}
            </div>
            {selectedTeam && !teamDetails && renderLoading}
            {selectedTeam && teamDetails && (
              <Box ref={playersSectionRef} sx={{ marginTop: 4 }}>
                <div className="flex items-center gap-2">
                  <img src={teamDetails.logo || defaultTeam} alt={teamDetails.title} className="rounded-full shadow-lg h-20 w-20" />
                  <Typography variant="h4" fontWeight="bold">{teamDetails.title}</Typography>
                </div>
                <Divider sx={{ marginBottom: 2 }} />
                <Button onClick={handleAddPlayer} sx={{ color: 'white', background: "gray", fontSize: '14px' }}>Добавить Игрока</Button>
                <Typography variant="h5" fontWeight="bold">Игроки:</Typography>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                  {teamDetails.players?.length > 0 ? teamDetails.players.map(player => (
                    <li key={player.id} className="mt-4">{renderCard(player, handleDeletePlayer, handleEditPlayer, true)}</li>
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
              <Button className="bg-tundora text-white text-base" onClick={handleAddTourney}>Добавить Турнир</Button>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
              {tournaments.map(tournament => renderCard(tournament, handleDeleteTourney, handleEditTourney))}
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
              {leagues.map(league => renderCard(league, () => {}, () => {}))}
            </div>
          </Box>
        );
      case "matches":
        if (error) return renderError;
        return (
          <Box>
            <div className="mb-4 flex justify-between items-center max-md:flex-col">
              <Typography variant="h5" fontWeight="bold">Список Матчей</Typography>
              <div className="flex gap-2 max-md:mt-2">
                <Button className="bg-tundora text-white text-base max-md:text-sm" onClick={handleAddMatch}>Добавить Матч</Button>
                <Button className="bg-blue text-white text-base max-md:text-sm" onClick={() => handleAddPrize(selectedTourneyId)}>Распределить места</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
              {matches.map(match => renderCard(match, handleDeleteMatch, handleEditMatch, false, true))}
            </div>
            <Box className="mt-10">
              {expandedMatchId && (
                <>
                  <Button className="bg-tundora text-white text-base max-md:text-sm">Добавить Голы</Button>
                  <Typography variant="h5" fontWeight="bold">Голы:</Typography>
                  {goals.length === 0 ? (
                    <Typography variant="body2">Голов в этом матче пока нет.</Typography>
                  ) : (
                    <>
                      {goals.filter(goal => String(goal.game) === String(expandedMatchId)).length > 0 ? (
                        <ul className="list-disc pl-6 mt-2">
                          {goals.filter(goal => goal.game === expandedMatchId).map((goal, index) => (
                            <li key={goal.id || index}><Typography variant="body2">Гол: игрок #{goal.playerId}</Typography></li>
                          ))}
                        </ul>
                      ) : (
                        <Typography variant="body2">Голов в этом матче пока нет.</Typography>
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return renderTabContent();
};
