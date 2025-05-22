import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Box, Typography, Button, CircularProgress, Divider } from "@mui/material";
import { apiClient } from "~shared/lib/api";
import { toast } from "react-toastify";
import { GoalDialog } from "~features/GoalDialog";
import { AssistDialog } from "~features/AssistsDialog";
import { pathKeys } from "~shared/lib/react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const DashboardMatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [goals, setGoals] = useState<any[]>([]);
  const [assists, setAssists] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [selectedAssist, setSelectedAssist] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [score, setScore] = useState<any[]>([]);

  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const handleCloseGoalDialog = () => setOpenGoalDialog(false);
  
  const [openAssistsDialog, setOpenAssistsDialog] = useState(false);
  const handleCloseAssistsDialog = () => setOpenAssistsDialog(false);

  useEffect(() => {
      if (id) {
        apiClient.get(`/api/games/${id}`)
          .then(response => {
            if (response.data && typeof response.data === 'object') {
              setSelectedMatch(response.data);
            } else {
              setError("Неверный формат данных от сервера");
            }
          })
          .catch(error => {
            console.error("API Error:", error);
            setError("Ошибка загрузки данных матча");
          });
        apiClient.get(`/game/scores/${id}`)
          .then(response => {
            if (response.data && typeof response.data === 'object') {
              setScore(response.data);
            } else {
              setError("Неверный формат данных от сервера");
            }
          })
          .catch(error => {
            console.error("API Error:", error);
            setError("Ошибка загрузки данных cчета");
          });
      }
  }, [id]);

  const fetchGoals = useCallback(async (matchId: string) => {
    try {
      const response = await apiClient.get(`/game/goals/${matchId}`);
      console.log(response.data);
      setGoals(response.data);
    } catch (error) {
      console.error("Ошибка при получении голов:", error);
      toast.error("Не удалось загрузить голы");
    }
  }, []);

  const fetchAssists = useCallback(async (matchId: string) => {
    try {
      const response = await apiClient.get(`/game/assists/${matchId}`);
      console.log(response.data);
      setAssists(response.data);
    } catch (error: any) {
      console.error("Ошибка при получении ассистов:", error?.response?.data || error.message);
      toast.error("Не удалось загрузить ассисты");
    }
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiClient.get("/api/teams");
        if (Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          setError("Некорректный формат данных от сервера");
        }
      } catch {
        setError("Ошибка загрузки списка команд");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedMatch?.id) {
      fetchGoals(selectedMatch.id);
      fetchAssists(selectedMatch.id);
    }
  }, [selectedMatch, fetchGoals, fetchAssists]);

  const handleDeleteGoal = useCallback((goalId: string) => {
      if (window.confirm("Вы уверены, что хотите удалить этот гол?")) {
        apiClient.delete(`/api/admin/goal/remove/${goalId}`)
          .then(() => {
            // После успешного удаления получаем актуальные данные
            const gameId = selectedMatch?.id;
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
            const gameId = selectedMatch?.id;
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

  const handleAddGoal = () => {
    setSelectedGoal(null);
    setOpenGoalDialog(true);
  };

  const handleAddAssist = () => {
    setSelectedAssist(null);
    setOpenAssistsDialog(true);
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setOpenGoalDialog(true);
  };

  const handleEditAssist = (assist) => {
    setSelectedAssist(assist);
    setOpenAssistsDialog(true);
  };

  const assistsWithTeamTitles = assists
  ? {
      ...assists,
      winnerTeamTitle: goals?.winnerTeamTitle || "",
      loserTeamTitle: goals?.loserTeamTitle || "",
    }
  : assists;


  if (loading) {
    return (
      <Container>
        <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>
      </Container>
    );
  }

  return (
    <Container className="max-w-[1440px] mb-10">
      {selectedMatch && (
        <Box className="mt-10">
          <div className="flex justify-between max-md:flex-col mb-8">
             <Link to={pathKeys.dashboard.root()} 
              className="max-md:p-1 bg-dove p-2 max-md:mb-2 rounded text-white inline-block text-blue hover:underline text-base max-md:text-sm">
              <ArrowBackIcon /> Назад
            </Link>
            <div className="flex gap-2">
              <Button className="bg-tundora text-white text-base max-md:text-xs" onClick={() => handleAddGoal()}>Добавить Голы</Button>
              <Button className="bg-tundora text-white text-base max-md:text-xs" onClick={() => handleAddAssist()}>Добавить Ассисты</Button>
            </div>
          </div>
          <Typography variant="h6" className="text-3xl max-md:text-xl justify-center flex " fontWeight="bold">
              {score.loserTeamScore} vs {score.winnerTeamScore}
          </Typography>
           {[
            { title: "Голы", data: goals, key: "TeamGoals", action: handleDeleteGoal },
            { title: "Ассисты", data: assistsWithTeamTitles, key: "TeamAssists", action: handleDeleteAssist }
          ]
          .map(({ title, data, key, action }, index, array) => data && (
            <React.Fragment key={title}>
              <div className="flex flex-col mb-8 gap-4">
                <Typography variant="h6" className="text-xl max-md:text-sm" fontWeight="bold">{title}:</Typography>
                <div className="flex max-md:flex-col gap-6 justify-between">
                  {["winner", "loser"].map(teamType => {
                    const teamData = data[`${teamType}${key}`] || [];
                    const teamTitle = data[`${teamType}TeamTitle`];
                    return (
                      <div key={teamType} className="w-full">
                        <Typography variant="subtitle1" fontWeight="bold" className="mb-2 text-xl max-md:text-base text-center">{teamTitle}</Typography>
                        {teamData.length ? (
                          <ul>
                            {teamData.map((item, index) => (
                              <li key={item.id || index} className="mb-2">
                                <Card sx={{ padding: 2, boxShadow: 2, borderRadius: 2 }} className="flex justify-between max-md:flex-col">
                                  <div className="max-md:mb-1">
                                    <Typography className="max-md:text-base text-md font-semibold text-gray-800">
                                      {title === "Голы" ? item.goalAuthor?.playerName : item.assistAuthor?.playerName || "Неизвестен"} ({title.slice(0, -1)})
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                      {title === "Голы" ? `Ассист: ${item.assistAuthor?.playerName || "Нет"}` : `Гол: ${item.goalAuthorName || "Нет"}`}
                                    </Typography>
                                  </div>
                                  <div className="flex max-md:flex-col justify-end gap-2 mt-1">
                                    <Button className="text-sm" onClick={() => (title === "Голы" ? handleEditGoal : handleEditAssist)(item)} sx={{ backgroundColor: "#ff9800", color: "white", padding: 1 }}>Редактировать</Button>
                                    <Button
                                      className="text-sm"
                                      onClick={() =>
                                        title === "Голы"
                                          ? action(item.goalId)
                                          : action(item.assistId)
                                      }
                                      sx={{ backgroundColor: "error.main", color: "white", padding: 1 }}
                                    >
                                      Удалить
                                    </Button>
                                  </div>
                                </Card>
                              </li>
                            ))}
                          </ul>
                        ) : <Typography variant="body2" className="text-gray-500 text-center">Нет {title.toLowerCase()}</Typography>}
                      </div>
                    );
                  })}
                </div>
              </div>
              {index < array.length - 1 && <Divider className="my-4" />}
            </React.Fragment>
          ))}
        </Box>
      )}
      <GoalDialog 
        open={openGoalDialog}
        onClose={handleCloseGoalDialog}
        gameId={selectedMatch?.id}
        teams={teams}
        setMatches={setMatches} 
        selectedMatch={selectedMatch} 
        selectedGoal={selectedGoal}
      />
      <AssistDialog 
        open={openAssistsDialog}
        onClose={handleCloseAssistsDialog}
        gameId={selectedMatch?.id}
        setMatches={setMatches} 
        selectedMatch={selectedMatch} 
        goals={goals}
        teams={teams}
        selectedAssist={selectedAssist}
      />
    </Container>
  );
};
