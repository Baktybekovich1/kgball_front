import { Box, Card, CardContent, Typography, CircularProgress, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, Chip } from "@mui/material";
import defaultTeam from "~shared/assets/img/defaultTeam.webp";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";
import { useRef, useEffect, useState } from "react";
import React from "react";
import { apiClient } from "~shared/lib/api";
import { pathKeys } from "~shared/lib/react-router";
import { Link } from "react-router-dom"; 
import { toast } from "react-toastify";

interface DashboardRenderContentProps {
  activeTab: string;
  loading: boolean;
  error: string;
  teams: any[];
  matches: any[];
  tournaments: any[];
  leagues: any[];
  bestByMonthData: any[];
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
  setSelectedPrize: (prize: any) => void;
  selectedTourney: any;
  setOpenMatchDialog: (boolean) => void; 
  setSelectedMatch: (id) => void; 
  handleDeleteMatch: (id) => void; 
  handleSelectMatch: (id) => void;
}

export const DashboardRenderContent: React.FC<DashboardRenderContentProps> = ({
  activeTab, loading, error, teams, matches, tournaments, leagues, bestByMonthData,
  selectedTeam, setSelectedTeam, setSelectedPlayerId, teamDetails, 
  handleCreateTeamClick, handleDeleteTeam, handleOpenPlayerDialog, 
  handleDeletePlayer, handleEditTeam, setPlayerDetails, handleOpenTournamentClick, 
  setSelectedTourney, handleDeleteTourney, setActiveTab, setOpenPrizeDialog, setSelectedPrize,
  selectedTourney, setOpenMatchDialog, setSelectedMatch, 
  handleDeleteMatch, handleSelectMatch,
}) => {  
  const [prize, setPrize] = useState<any>(null);
  const [openCompleteTourneyDialog, setOpenCompleteTourneyDialog] = useState(false);
  const [tourneyPlayers, setTourneyPlayers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGoalkeeper, setSelectedGoalkeeper] = useState<any>(null);
  const [selectedDefender, setSelectedDefender] = useState<any>(null);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [isTourneyFinished, setIsTourneyFinished] = useState<boolean>(false);
  const [loadingFinished, setLoadingFinished] = useState(false);

  useEffect(() => {
    if (selectedTourney) {
      FetchPrizes(selectedTourney);
    }
  }, [selectedTourney]);

  useEffect(() => {
    const fetchFinished = async () => {
      if (!selectedTourney) return;
      setLoadingFinished(true);
      try {
        const res = await apiClient.get(`/api/admin/tourney/finished/${selectedTourney.id}`);
        setIsTourneyFinished(res.data === true);
      } catch (e) {
        setIsTourneyFinished(false);
      } finally {
        setLoadingFinished(false);
      }
    };
    fetchFinished();
  }, [selectedTourney]);

  const handleSetTourneyFinished = async (finished: boolean) => {
    if (!selectedTourney) return;
    setLoadingFinished(true);
    try {
      await apiClient.patch(`/api/admin/tourney/finished/edit/${selectedTourney.id}`, { finished: finished ? true : false });
      setIsTourneyFinished(finished);
      toast.success(finished ? 'Турнир завершён!' : 'Турнир снова открыт для редактирования!');
    } catch (e) {
      toast.error('Ошибка при изменении статуса турнира');
    } finally {
      setLoadingFinished(false);
    }
  };

  const FetchPrizes = (selectedTourney) => {
    if (selectedTourney) {
      apiClient.get(`tourney/prizes/${selectedTourney.id}`)
        .then(response => {
          if (response.data) {
            setPrize(response.data);
          } 
        })
        .catch(error => {
          console.error("API Error:", error);
        });
    }
  };

  const playersSectionRef = useRef<HTMLDivElement>(null);

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

  const handleOpenPrizeDialog = (tourney: any) => {
    setSelectedTourney(tourney);
    setOpenPrizeDialog(true);
  };

  const handleAddPrize = (tourney: any) => {
    handleOpenPrizeDialog(tourney);
  }; 

  const handleEditPrize = (tourney: any, prize: any) => {
    setSelectedPrize(prize);
    handleOpenPrizeDialog(tourney);
  };

  const handleAddMatch = () => {
    setSelectedMatch(null); 
    setOpenMatchDialog(true);
  };

  const handleEditMatch = (match: any) => {
    setSelectedMatch(match); 
    setOpenMatchDialog(true);
  };

  const handleCompleteTourney = () => {
    setOpenCompleteTourneyDialog(true);
    fetchTourneyPlayers();
  };

  const handleCloseCompleteTourneyDialog = () => {
    setOpenCompleteTourneyDialog(false);
    setSearchTerm('');
    setSelectedGoalkeeper(null);
    setSelectedDefender(null);
  };

  const fetchTourneyPlayers = async () => {
    if (!selectedTourney) return;
    
    setLoadingPlayers(true);
    try {
      const response = await apiClient.get(`/api/teams`);
      const allTeams = response.data;
      
      const allPlayers: any[] = [];
      
      for (const team of allTeams) {
        try {
          const squadResponse = await apiClient.get(`/team/squad_list/${team.id}`);
          const players = squadResponse.data.players || [];
          allPlayers.push(...players.map((player: any) => ({
            ...player,
            teamTitle: team.title
          })));
        } catch (error) {
          console.error(`Ошибка загрузки игроков команды ${team.title}:`, error);
        }
      }
      
      setTourneyPlayers(allPlayers);
    } catch (error) {
      console.error("Ошибка загрузки игроков турнира:", error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleConfirmCompleteTourney = async () => {
    if (!selectedGoalkeeper || !selectedDefender || !selectedTourney) {
      toast.error("Пожалуйста, выберите вратаря и защитника");
      return;
    }

    try {
      const response = await apiClient.post('/api/admin/tourney/player/prizes/add', {
        tourneyId: selectedTourney.id,
        goalkeeperId: selectedGoalkeeper.id,
        defenderId: selectedDefender.id
      });

      if (response.status === 200) {
        toast.success("Турнир успешно завершен!");
        handleCloseCompleteTourneyDialog();
      }
    } catch (error) {
      console.error("Ошибка завершения турнира:", error);
      toast.error("Ошибка при завершении турнира");
    }
  };

  const filteredPlayers = tourneyPlayers.filter(player => 
    player.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.teamTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goalkeepers = filteredPlayers.filter(player => 
    player.position?.toLowerCase().includes('вратарь') || 
    player.position?.toLowerCase().includes('goalkeeper')
  );

  const defenders = filteredPlayers.filter(player => 
    player.position?.toLowerCase().includes('защитник') || 
    player.position?.toLowerCase().includes('defender')
  );

  const renderLoading = <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>;
  const renderError = <Typography color="error">{error}</Typography>;
  
  const renderCard = (item, onDelete, onEdit, isPlayer = false, isMatch = false) => {
    const handleDelete = () => onDelete(isMatch ? item.gameId : item.id);
    const handleEdit = () => (isPlayer ? handleEditPlayer(item.id) : onEdit(item));
    const handleDetailsClick = () => {
      if (!isPlayer && !isMatch) {
        if (item.players) {
          setSelectedTeam(item);
          handleScrollToPlayers();
        } else {
          setSelectedTourney(item);
          setActiveTab("matches");
          setPrize(null);
          handleSelectMatch(null);
          FetchPrizes(item);
        }
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
                  <span>{item.loserTeamGoals}</span><span>VS</span><span>{item.winnerTeamGoals}</span>
                </div>
                <Typography className="font-semibold">{item.winnerTeamTitle}</Typography>
              </Box>
              <div className="flex flex-col max-md:w-full mt-2 gap-3">
                <Link 
                  to={pathKeys.dashboard.dashboardMatch(String(item.gameId))} 
                  style={{ backgroundColor: "blue", color: "white", textAlign: "center", padding: "8px", borderRadius: "5px" }}
                >
                  ПОДРОБНЕЕ
                </Link>
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
      case "bestByMonth":
        if (loading) return renderLoading;
        if (error) return renderError;
        return (
          <Box>
            <div className="mb-4 flex justify-between items-center">
              <Typography variant="h5" fontWeight="bold">Лучшие по месяцам</Typography>
              <Button className="bg-tundora text-white text-base">Добавить месяц</Button>
            </div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
              {bestByMonthData.length > 0 ? (
                bestByMonthData.map((item, index) => (
                  <Card key={index} className="p-4">
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {item.month || `Месяц ${index + 1}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description || 'Описание месяца'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Пока нет данных о лучших по месяцам
                </Typography>
              )}
            </div>
          </Box>
        );
        case "matches":
          if (loading) return renderLoading;
          if (error) return renderError;
          return (
            <Box>
              <div className="mb-4 flex justify-between items-center max-md:flex-col">
                <Typography variant="h5" fontWeight="bold">Список Матчей</Typography>
                <div className="flex gap-2 max-md:mt-2">
                  <Button className="bg-tundora text-white text-base max-md:text-sm" onClick={handleAddMatch} disabled={isTourneyFinished}>Добавить Матч</Button>
                  {prize ? (
                    <Button className="bg-blue text-white text-base max-md:text-sm" onClick={() => handleEditPrize(selectedTourney, prize)} disabled={isTourneyFinished}>Редактировать места</Button>
                  ) : (
                    <Button className="bg-blue text-white text-base max-md:text-sm" onClick={() => handleAddPrize(selectedTourney)} disabled={isTourneyFinished}>Распределить места</Button>
                  )}
                  {!isTourneyFinished ? (
                    <Button 
                      className="bg-blue text-white text-base max-md:text-sm" 
                      onClick={handleCompleteTourney}
                      disabled={!selectedTourney || isTourneyFinished}
                    >
                      Завершить турнир
                    </Button>
                  ) : (
                    <Button 
                      className="bg-blue text-white text-base max-md:text-sm" 
                      onClick={() => handleSetTourneyFinished(false)}
                      disabled={loadingFinished}
                    >
                      Продолжить турнир
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 col-span-2 sm:col-span-3 mb-4">
                {prize && (
                  [
                    { title: prize.firstPositionTeamTitle },
                    { title: prize.secondPositionTeamTitle },
                    { title: prize.thirdPositionTeamTitle }
                  ].map((team, index) => (
                    <div key={index} className="flex flex-col gap-3">
                      <div className="flex items-center bg-[#1111] justify-between text-black rounded-xl p-3">
                        <Typography className="text-lg font-semibold max-md:text-base">
                          {team.title}
                        </Typography>
                        <Typography className="text-2xl max-md:text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </Typography>
                      </div>
                    </div>
                  ))
                ) }
              </div>
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
              {matches.map(match => (
                  <React.Fragment key={match.gameId}>
                    {renderCard(match, handleDeleteMatch, handleEditMatch, false, true)}
                  </React.Fragment>
                ))}
              </div>
            </Box>
          );
      default:
        return null;
    }
  };
  
  return (
    <>
      {renderTabContent()}
      
      {/* Модалка завершения турнира */}
      <Dialog 
        open={openCompleteTourneyDialog} 
        onClose={handleCloseCompleteTourneyDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Завершить турнир "{selectedTourney?.title}"
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Выберите лучших игроков турнира:
          </Typography>
          
          <TextField
            fullWidth
            label="Поиск игроков"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
            placeholder="Поиск по имени, команде или позиции..."
          />
          
          {loadingPlayers ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Box display="flex" gap={3}>
              {/* Вратари */}
              <Box flex={1}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Лучший вратарь
                </Typography>
                {selectedGoalkeeper && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedGoalkeeper.name} {selectedGoalkeeper.surname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedGoalkeeper.teamTitle} • {selectedGoalkeeper.position}
                    </Typography>
                  </Box>
                )}
                <List sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  {goalkeepers.map((player) => (
                    <ListItem 
                      key={player.id}
                      component="div"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                        backgroundColor: selectedGoalkeeper?.id === player.id ? 'action.selected' : 'transparent'
                      }}
                      onClick={() => setSelectedGoalkeeper(player)}
                    >
                      <ListItemText
                        primary={`${player.name} ${player.surname}`}
                        secondary={`${player.teamTitle} • ${player.position}`}
                      />
                    </ListItem>
                  ))}
                  {goalkeepers.length === 0 && (
                    <ListItem>
                      <ListItemText primary="Вратари не найдены" />
                    </ListItem>
                  )}
                </List>
              </Box>
              
              {/* Защитники */}
              <Box flex={1}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Лучший защитник
                </Typography>
                {selectedDefender && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedDefender.name} {selectedDefender.surname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedDefender.teamTitle} • {selectedDefender.position}
                    </Typography>
                  </Box>
                )}
                <List sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  {defenders.map((player) => (
                    <ListItem 
                      key={player.id}
                      component="div"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                        backgroundColor: selectedDefender?.id === player.id ? 'action.selected' : 'transparent'
                      }}
                      onClick={() => setSelectedDefender(player)}
                    >
                      <ListItemText
                        primary={`${player.name} ${player.surname}`}
                        secondary={`${player.teamTitle} • ${player.position}`}
                      />
                    </ListItem>
                  ))}
                  {defenders.length === 0 && (
                    <ListItem>
                      <ListItemText primary="Защитники не найдены" />
                    </ListItem>
                  )}
                </List>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseCompleteTourneyDialog}>
            Отмена
          </Button>
          <Button 
            onClick={handleConfirmCompleteTourney}
            variant="contained"
            color="primary"
            disabled={!selectedGoalkeeper || !selectedDefender}
          >
            Завершить турнир
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
