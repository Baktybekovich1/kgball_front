import { Box } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "~shared/lib/api";
import { DashboardRenderContent } from "~widgets/DashboardRenderContent";
import { PlayerDialog } from "~features/PlayerDialog";
import { TeamDialog } from "~features/TeamDialog";
import { TourneyDialog } from "~features/TourneyDialog";
import { AddTourneyPrize } from "~features/AddTourneyPrize";
import { MatchDialog } from "~features/MatchDialog";
import { GoalDialog } from "~features/GoalDialog";
import { AssistDialog } from "~features/AssistsDialog";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DashboardContentProps {
  activeTab: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string;
  teams: any[];
  tournaments: any[];
  leagues: any[];
  setTeams: React.Dispatch<React.SetStateAction<any[]>>; 
  setTournaments: React.Dispatch<React.SetStateAction<any[]>>; 
  setActiveTab: (tab: string) => void; 
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab, loading, setLoading, error, teams, tournaments, leagues, setTeams, setTournaments, setActiveTab,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teamDetails, setTeamDetails] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false); 
  const [openPlayerDialog, setOpenPlayerDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [assists, setAssists] = useState<any[]>([]);

  const [selectedTourney, setSelectedTourney] = useState<any>(null);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [selectedPrize, setSelectedPrize] = useState<any>(null);
  const [selectedAssist, setSelectedAssist] = useState<any>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [playerDetails, setPlayerDetails] = useState<string | null>(null);

  const handleOpenPlayerDialog = useCallback(() => setOpenPlayerDialog(true), []);
  const handleClosePlayerDialog = useCallback(() => setOpenPlayerDialog(false), []);

  const handleCreateTeamClick = useCallback(() => {
    setSelectedTeam(null); 
    setOpenDialog(true);
  }, []);
  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  
  const [openTourneyDialog, setOpenTourneyDialog] = useState(false);
  const handleCloseTourneyDialog = () => setOpenTourneyDialog(false);
  const handleOpenTournamentClick = () => setOpenTourneyDialog(true);

  const [openPrizeDialog, setOpenPrizeDialog] = useState(false);
  const handleClosePrizeDialog = () => setOpenPrizeDialog(false);

  const [openMatchDialog, setOpenMatchDialog] = useState(false);
  const handleCloseMatchDialog = () => setOpenMatchDialog(false);

  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const handleCloseGoalDialog = () => setOpenGoalDialog(false);

  const [openAssistsDialog, setOpenAssistsDialog] = useState(false);
  const handleCloseAssistsDialog = () => setOpenAssistsDialog(false);

  useEffect(() => {
    apiClient.get("/api/teams").then((res) => setTeams(res.data));
  }, []);
  
  const fetchMatches = useCallback(async (tourneyId: number) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/game/tourney/games/${tourneyId}`);
      setMatches(response.data); 
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке матчей:", error);
      toast.error("Не удалось загрузить матчи");
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (selectedTourney !== null) {
      localStorage.setItem("selectedTourney", JSON.stringify(selectedTourney));
    }
  }, [selectedTourney]); 

  useEffect(() => {
    const savedTourney = localStorage.getItem("selectedTourney");
    if (savedTourney) {
      const parsedTourney = JSON.parse(savedTourney); 
      setSelectedTourney(parsedTourney);
    }
  }, []); 
  
  useEffect(() => {
    if (selectedTourney && activeTab === "matches") {
      fetchMatches(selectedTourney.id);
    }
  }, [selectedTourney, activeTab, fetchMatches]); 
  
  const fetchGoals = useCallback(async (matchId: string) => {
    try {
      const response = await apiClient.get(`/game/goals/${matchId}`);
      setGoals(response.data);
    } catch (error) {
      console.error("Ошибка при получении голов:", error);
      toast.error("Не удалось загрузить голы");
    }
  }, []);

  const fetchAssists = useCallback(async (matchId: string) => {
    try {
      const response = await apiClient.get(`/game/assists/${matchId}`);
      setAssists(response.data);
      console.log(response.data);
    } catch (error: any) {
      console.error("Ошибка при получении ассистов:", error?.response?.data || error.message);
      toast.error("Не удалось загрузить ассисты");
    }
  }, []);
  
  const FetchSelectedMatch = () => {
    const savedMatch = localStorage.getItem("selectedMatch");
      if (savedMatch) {
          const parsedMatch = JSON.parse(savedMatch); // Парсим строку в объект
          fetchGoals(parsedMatch.gameId);
          fetchAssists(parsedMatch.gameId);
          setSelectedMatch(parsedMatch); // Передаём объект
      }
  };

  const handleSelectMatch = (match: any | null) => {
      if (!match) {
          setSelectedMatch(null);
          localStorage.removeItem("selectedMatch");
          return;
      }
      setSelectedMatch(match);
      localStorage.setItem("selectedMatch", JSON.stringify(match)); // Сохраняем объект в строку
      FetchSelectedMatch();
  };
  
  const fetchTeamDetails = useCallback(async (teamId: string) => {
    setTeamDetails(null); 
    try {
      const [teamResponse, squadResponse] = await Promise.all([
        apiClient.get(`/api/teams/${teamId}`),
        apiClient.get(`/team/squad_list/${teamId}`),
      ]);
      setTeamDetails({
        ...teamResponse.data,
        players: squadResponse.data.players,
      });
    } catch (error) {
      console.log("Ошибка загрузки данных команды");
    }
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamDetails(selectedTeam.id);
    }
  }, [selectedTeam]);

  const handleDeleteTeam = useCallback((id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту команду?")) {
      apiClient.delete(`/api/admin/team/remove/${id}`)
        .then(() => {
          setTeams((prevTeams) => prevTeams.filter((team) => team.id !== id));
          toast.success("Команда удалена успешно");
        })
        .catch((error) => {
          console.error("Ошибка при удалении команды:", error);
          toast.error("Не удалось удалить команду");
        });
    }
  }, [setTeams]);

  const handleDeleteTourney = useCallback((id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот турнир?")) {
      apiClient.delete(`/api/admin/tourney/remove/${id}`)
        .then(() => {
          setTournaments((prevTournaments) => prevTournaments.filter((tournament) => tournament.id !== id));
          toast.success("Турнир удален успешно");
        })
        .catch((error) => {
          console.error("Ошибка при удалении турнира:", error);
          toast.error("Не удалось удалить турнир");
        });
    }
  }, []);
  
  const handleDeletePlayer = useCallback((playerId: string) => {
    apiClient.delete(`/api/admin/player/remove/${playerId}`)
      .then(() => {
        setTeamDetails((prevDetails) => ({
          ...prevDetails,
          players: prevDetails.players.filter(player => player.id !== playerId),
        }));
        toast.success("Игрок удален успешно");
      })
      .catch((error) => {
        console.error("Ошибка при удалении игрока:", error);
        toast.error("Не удалось удалить игрока");
      });
  }, []);

  const handleDeleteMatch = useCallback(async (gameId: string) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот матч и его голы?")) return;
  
    try {
      // Получаем голы
      const response = await apiClient.get(`/game/goals/${gameId}`);
      const { winnerTeamGoals, loserTeamGoals } = response.data;
  
      const allGoals = [...winnerTeamGoals, ...loserTeamGoals];
  
      if (allGoals.length === 0) {
        console.log("Нет голов для удаления");
        toast.success("Матч удалён без голов");
      } else {
        await Promise.all(
          allGoals.map((goal: any) => {
            if (goal.goalId) { 
              return apiClient.delete(`/api/admin/goal/remove/${goal.goalId}`);
            } else {
              console.error("Отсутствует goalId для гола", goal);
              toast.error("Не удалось удалить гол: отсутствует goalId");
            }
          })
        );
        toast.success("Голы удалены успешно");
      }
  
      // Удаляем сам матч
      await apiClient.delete(`/api/admin/game/remove/${gameId}`);
  
      // Обновляем список матчей
      setMatches((prevMatches) => prevMatches.filter((match) => match.id !== gameId));
      toast.success("Матч удален успешно");
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при удалении матча и голов:", error);
      toast.error("Не удалось удалить матч или его голы");
    }
  }, [setMatches]);

  const handleDeleteGoal = useCallback((goalId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот гол?")) {
      apiClient.delete(`/api/admin/goal/remove/${goalId}`)
        .then(() => {
          // После успешного удаления получаем актуальные данные
          const gameId = selectedMatch?.gameId;
          if (gameId) {
            fetchGoals(gameId); // Перезагружаем голы для матча
          }
          toast.success("Гол удален успешно");
        })
        .catch((error) => {
          console.error("Ошибка при удалении гола:", error);
          toast.error("Не удалось удалить гол");
        });
    }
  }, [selectedMatch, fetchGoals]);

  const handleDeleteAssist = useCallback((assistId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот ассист?")) {
      apiClient.delete(`/api/admin/assist/remove/${assistId}`)
        .then(() => {
          // После успешного удаления получаем актуальные данные
          const gameId = selectedMatch?.gameId;
          if (gameId) {
            fetchAssists(gameId); // Перезагружаем ассисты для матча
          }
          toast.success("Ассист удален успешно");
        })
        .catch((error) => {
          console.error("Ошибка при удалении ассиста:", error);
          toast.error("Не удалось удалить ассист");
        });
    }
  }, [selectedMatch, fetchGoals]);
  
  const handleEditTeam = (team: any) => {
    setSelectedTeam(team);
    setTitle(team.title); 
    setPreviewLogo(team.logo); 
    setLogo(null); 
    setOpenDialog(true); 
  };

  return (
    <Box>
      <DashboardRenderContent
        activeTab={activeTab}
        loading={loading}
        error={error}
        teams={teams}
        matches={matches}
        tournaments={tournaments}
        leagues={leagues}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        teamDetails={teamDetails}
        handleCreateTeamClick={handleCreateTeamClick}
        handleEditTeam={handleEditTeam}
        handleDeleteTeam={handleDeleteTeam} 
        handleOpenPlayerDialog={handleOpenPlayerDialog}
        handleDeletePlayer={handleDeletePlayer}
        setSelectedPlayerId={setSelectedPlayerId}
        setPlayerDetails={setPlayerDetails}
        handleOpenTournamentClick={handleOpenTournamentClick}
        setSelectedTourney={setSelectedTourney}
        handleDeleteTourney={handleDeleteTourney}
        setActiveTab={setActiveTab}
        setOpenPrizeDialog={setOpenPrizeDialog}
        selectedTourney={selectedTourney}
        setOpenMatchDialog={setOpenMatchDialog}
        setSelectedMatch={setSelectedMatch}
        handleDeleteMatch={handleDeleteMatch}
        selectedMatch={selectedMatch}
        goals={goals}
        setOpenGoalDialog={setOpenGoalDialog}
        handleDeleteGoal={handleDeleteGoal}
        setSelectedGoal={setSelectedGoal}
        assists={assists}
        setOpenAssistsDialog={setOpenAssistsDialog}
        setSelectedAssist={setSelectedAssist}
        handleDeleteAssist={handleDeleteAssist}
        handleSelectMatch={handleSelectMatch}
        setSelectedPrize={setSelectedPrize}
      />
      <TeamDialog
        open={openDialog}
        onClose={handleCloseDialog}
        selectedTeam={selectedTeam}
        setTeams={setTeams}
      />
      <PlayerDialog 
        open={openPlayerDialog} 
        onClose={handleClosePlayerDialog} 
        teamId={selectedTeam?.id} 
        setTeamDetails={setTeamDetails}
        playerId={selectedPlayerId} 
        playerDetails={playerDetails}
      />
      <TourneyDialog
        open={openTourneyDialog}
        onClose={handleCloseTourneyDialog}
        selectedTourney={selectedTourney}
        setTourneys={setSelectedTourney}
      />
      <AddTourneyPrize
        open={openPrizeDialog}
        onClose={handleClosePrizeDialog}
        tourneyId={selectedTourney?.id}
        teams={teams} 
        selectedPrize={selectedPrize}
      />
      <MatchDialog 
        open={openMatchDialog}
        onClose={handleCloseMatchDialog}
        setMatches={setMatches}
        selectedMatch={selectedMatch}
        tourneyId={selectedTourney?.id}
        teams={teams}
      />
      <GoalDialog 
        open={openGoalDialog}
        onClose={handleCloseGoalDialog}
        gameId={selectedMatch?.gameId}
        teams={teams}
        setMatches={setMatches} 
        selectedMatch={selectedMatch} 
        selectedGoal={selectedGoal}
      />
      <AssistDialog 
        open={openAssistsDialog}
        onClose={handleCloseAssistsDialog}
        gameId={selectedMatch?.gameId}
        setMatches={setMatches} 
        selectedMatch={selectedMatch} 
        goals={goals}
        teams={teams}
        selectedAssist={selectedAssist}
      />
    </Box>
  );
};
export default DashboardContent;