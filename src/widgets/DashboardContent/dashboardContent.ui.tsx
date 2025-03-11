import { Box } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "~shared/lib/api";
import { DashboardRenderContent } from "~widgets/DashboardRenderContent";
import { PlayerDialog } from "~widgets/PlayerDialog";
import { TeamDialog } from "~widgets/TeamDialog";
import { TourneyDialog } from "~widgets/TourneyDialog";
import { AddTourneyPrize } from "~widgets/AddTourneyPrize";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DashboardContentProps {
  activeTab: string;
  loading: boolean;
  error: string;
  teams: any[];
  tournaments: any[];
  leagues: any[];
  setTeams: React.Dispatch<React.SetStateAction<any[]>>; 
  setTournaments: React.Dispatch<React.SetStateAction<any[]>>; 
  setActiveTab: (tab: string) => void; 
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab, loading, error, teams, tournaments, leagues, setTeams, setTournaments, setActiveTab,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teamDetails, setTeamDetails] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false); 
  const [openPlayerDialog, setOpenPlayerDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  
  const [selectedTourney, setSelectedTourney] = useState<any>(null);
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
  const [selectedTourneyId, setSelectedTourneyId] = useState<number | null>(null); 

  useEffect(() => {
    apiClient.get("/api/teams").then((res) => setTeams(res.data));
  }, []);

  useEffect(() => {
    if (selectedTourneyId !== null) {
      localStorage.setItem("selectedTourneyId", selectedTourneyId.toString());
    }
  }, [selectedTourneyId]);

  const fetchMatches = useCallback(async (tourneyId: number) => {
    console.log(tourneyId); 
    try {
      const response = await apiClient.get(`/game/tourney/games/${tourneyId}`);
      setMatches(response.data); 
      console.log(response.data); 
    } catch (error) {
      console.error("Ошибка при загрузке матчей:", error);
      toast.error("Не удалось загрузить матчи");
    }
  }, []);
  
  useEffect(() => {
    const savedTourneyId = localStorage.getItem("selectedTourneyId");
    if (savedTourneyId) {
      setSelectedTourneyId(Number(savedTourneyId));
    }
    if (selectedTourneyId && activeTab == "matches"){
      fetchMatches(selectedTourneyId);
    }
  }, [selectedTourneyId, fetchMatches]);

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
        setSelectedTourneyId={setSelectedTourneyId}
        selectedTourneyId={selectedTourneyId}
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
        tourneyId={Number(selectedTourneyId)}
        teams={teams} 
      />
    </Box>
  );
};
export default DashboardContent;