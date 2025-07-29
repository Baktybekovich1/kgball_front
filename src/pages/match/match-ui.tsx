import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Button, CircularProgress } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "~shared/lib/api";
import { MatchContent } from "~widgets/MatchContent/MatchContent.ui";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DefaultAvatar from "~shared/assets/img/User-avatar.png";
import { pathKeys } from "~shared/lib/react-router";

export const MatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("гол");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");

    const fetchMatchData = async () => {
      try {
        const matchResponse = await apiClient.get(`/api/games/${id}`);
        const match = matchResponse.data;

        const [winnerResponse, loserResponse, scoresResponse, winnerSquadResponse, loserSquadResponse, statsResponse, goalsResponse] = await Promise.all([
          apiClient.get(match.winnerTeam),
          apiClient.get(match.loserTeam),
          apiClient.get(`/game/scores/${id}`),
          apiClient.get(`/team/squad_list/${match.winnerTeam.split('/').pop()}`),
          apiClient.get(`/team/squad_list/${match.loserTeam.split('/').pop()}`),
          apiClient.get(`/team/game_statistics/${match.winnerTeam.split('/').pop()}/${match.loserTeam.split('/').pop()}`),
          apiClient.get(`/game/goals/${id}`),
        ]);

        setMatch({
          ...match,
          winnerTeamData: winnerResponse.data,
          loserTeamData: loserResponse.data,
        });

        setScores(Array.isArray(scoresResponse.data) ? scoresResponse.data : [scoresResponse.data]);
        setTeams({
          winner: winnerSquadResponse.data.players,
          loser: loserSquadResponse.data.players,
        });
        setStatistics(statsResponse.data);
        setGoals(goalsResponse.data);

      } catch (error) {
        console.error("Ошибка загрузки данных матча:", error);
        setError("Ошибка загрузки данных матча");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [id]);

  if (loading) return <Box className="flex justify-center items-center h-64"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[900px] mb-10">
      {match ? (
        <>
          <Link to={pathKeys.matches.root()} className="inline-block mb-4 text-blue-700 hover:underline text-base font-medium">
            <ArrowBackIcon fontSize="small" className="mr-1"/> Назад к матчам
          </Link>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col items-center">
            <div className="flex w-full justify-between items-center gap-4">
              <div className="flex flex-col items-center w-1/3">
                <img src={match.loserTeamData.logo || DefaultAvatar} alt={match.loserTeamData.title} className="w-20 h-20 rounded-full border-2 border-blue-200 shadow mb-2" />
                <h2 className="text-lg font-semibold text-blue-900 text-center truncate w-full">{match.loserTeamData.title}</h2>
              </div>
              <div className="flex flex-col items-center w-1/3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-blue-900">{scores.filter(score => score.loserTeamId === match.loserTeamData.id).reduce((sum, score) => sum + score.loserTeamScore, 0)}</span>
                  <span className="text-3xl font-bold text-red-500">:</span>
                  <span className="text-3xl font-bold text-blue-900">{scores.filter(score => score.winnerTeamId === match.winnerTeamData.id).reduce((sum, score) => sum + score.winnerTeamScore, 0)}</span>
                </div>
                <span className="text-xs text-blue-700 opacity-80">ID матча: {match.id}</span>
                <span className="text-xs text-blue-700 opacity-80">Дата: {match.date ? new Date(match.date).toLocaleDateString() : '-'}</span>
              </div>
              <div className="flex flex-col items-center w-1/3">
                <img src={match.winnerTeamData.logo || DefaultAvatar} alt={match.winnerTeamData.title} className="w-20 h-20 rounded-full border-2 border-blue-200 shadow mb-2" />
                <h2 className="text-lg font-semibold text-blue-900 text-center truncate w-full">{match.winnerTeamData.title}</h2>
              </div>
            </div>
          </div>
          <Box className="flex max-md:flex-col gap-2 mb-6 mt-2 w-full">
            <Button
              variant={selectedTab === "гол" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("гол")}
              sx={{ minWidth: 100, fontWeight: 500, borderRadius: 5, fontSize: 15, py: 1, px: 2, background: selectedTab === "гол" ? '#2563eb' : '#fff', color: selectedTab === "гол" ? '#fff' : '#2563eb', borderColor: '#2563eb', '&:hover': { background: '#1e40af', color: '#fff', borderColor: '#1e40af' } }}
            >
              Голы
            </Button>
            <Button
              variant={selectedTab === "состав" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("состав")}
              sx={{ minWidth: 100, fontWeight: 500, borderRadius: 5, fontSize: 15, py: 1, px: 2, background: selectedTab === "состав" ? '#2563eb' : '#fff', color: selectedTab === "состав" ? '#fff' : '#2563eb', borderColor: '#2563eb', '&:hover': { background: '#1e40af', color: '#fff', borderColor: '#1e40af' } }}
            >
              Составы
            </Button>
            <Button
              variant={selectedTab === "статистика" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("статистика")}
              sx={{ minWidth: 100, fontWeight: 500, borderRadius: 5, fontSize: 15, py: 1, px: 2, background: selectedTab === "статистика" ? '#2563eb' : '#fff', color: selectedTab === "статистика" ? '#fff' : '#2563eb', borderColor: '#2563eb', '&:hover': { background: '#1e40af', color: '#fff', borderColor: '#1e40af' } }}
            >
              Статистика
            </Button>
          </Box>

          <MatchContent selectedTab={selectedTab} statistics={statistics} match={match} scores={scores} teams={teams} goals={goals} />
        </>
      ) : (
        <Typography variant="h6" color="error">Матч не найден</Typography>
      )}
    </Container>
  );
};
