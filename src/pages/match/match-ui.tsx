import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
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

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10">
      {match ? (
        <>
          <Link to={pathKeys.matches.root()} className="bg-dove mb-1 p-2 rounded text-white inline-block text-blue hover:underline">
            <ArrowBackIcon /> Назад
          </Link>
          <div className="flex justify-between items-center border p-4 rounded-md">
            <div className="items-center">
              <img src={match.loserTeamData.logo || DefaultAvatar} alt={match.loserTeamData.title} className="w-16 h-16" />
              <h2 className="text-lg font-semibold">{match.loserTeamData.title}</h2>
              <p className="text-xl">Счет: {scores.filter(score => score.loserTeamId === match.loserTeamData.id).reduce((sum, score) => sum + score.loserTeamScore, 0)}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold">VS</p>
            </div>
            <div className="items-center">
              <img src={match.winnerTeamData.logo || DefaultAvatar} alt={match.winnerTeamData.title} className="w-16 h-16" />
              <h2 className="text-lg font-semibold">{match.winnerTeamData.title}</h2>
              <p className="text-xl">Счет: {scores.filter(score => score.winnerTeamId === match.winnerTeamData.id).reduce((sum, score) => sum + score.winnerTeamScore, 0)}</p>
            </div>
          </div>
          <Box className="flex max-md:flex-col gap-4 mb-6 mt-2">
            <Button
              variant={selectedTab === "гол" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("гол")}
              fullWidth
            >
              Гол
            </Button>
            <Button
              variant={selectedTab === "состав" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("состав")}
              fullWidth
            >
              Состав
            </Button>
            <Button
              variant={selectedTab === "статистика" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("статистика")}
              fullWidth
            >
              Статистика встреч
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
