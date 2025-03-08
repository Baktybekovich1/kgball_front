import { Box } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "~shared/lib/api";
import { DashboardRenderContent } from "~widgets/DashboardRenderContent";
import { PlayerDialog } from "~widgets/PlayerDialog";
import { TeamDialog } from "~widgets/TeamDialog";
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
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab, loading, error, teams, tournaments, leagues, setTeams,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teamDetails, setTeamDetails] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false); 
  const [openPlayerDialog, setOpenPlayerDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [playerDetails, setPlayerDetails] = useState<string | null>(null);

  const handleOpenPlayerDialog = useCallback(() => setOpenPlayerDialog(true), []);
  const handleClosePlayerDialog = useCallback(() => setOpenPlayerDialog(false), []);
  const handleCreateTeamClick = useCallback(() => {
    setSelectedTeam(null); 
    setOpenDialog(true);
  }, []);
  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);
  
  const fetchTeamDetails = useCallback(async (teamId: string) => {
    setTeamDetails(null); 
    try {
      const [teamResponse, squadResponse] = await Promise.all([
        apiClient.get(`/api/teams/${teamId}`),
        apiClient.get(`/team/squad_list/${teamId}`),
      ]);
      console.log(squadResponse.data.players);
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
    </Box>
  );
};
export default DashboardContent;