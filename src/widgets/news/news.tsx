import { Container, Paper, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { apiClient } from "~shared/lib/api";
import { pathKeys } from "~shared/lib/react-router";
import { Link } from "react-router-dom";
import { Calendar} from 'lucide-react';

export const News: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.get("game/all_games")
      .then(response => {
        console.log("API Response:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setMatches(response.data);
        } else {
          setError("Некорректный формат данных от сервера");
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("API Error:", error);
        setError("Ошибка загрузки списка матчей");
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const lastMatches = matches.slice(0, 3);

  return (
    <Container className="max-w-[1440px] mb-10 max-md:mb-5">
      <Box className="mb-12 p-6 rounded-xl shadow-lg bg-white">
        <div className="flex items-center mb-5">
          <Calendar className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold">Последние матчи</h2>
        </div>
        <div className="grid gap-4 grid-cols-3 max-md:grid-cols-1 " >
          {lastMatches.map((match, index) => (
            <Link
              to={pathKeys.matches.bySlug(String(match.gameId))}
              className="block duration-300 rounded-xl p-4 border border-gray"
            >
              <Box className="flex items-center justify-between">
                <Typography className="font-medium text-gray-700 text-lg w-1/3">
                  {match.loserTeamTitle}
                </Typography>

                <div className="flex flex-col items-center w-1/3">
                  <div className="text-sm text-gray-500 mb-1">Счёт</div>
                  <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <span>{match.loserTeamScore}</span>
                    <span className="text-red-500">:</span>
                    <span>{match.winnerTeamScore}</span>
                  </div>
                </div>

                <Typography className="font-medium text-gray-700 text-lg text-right w-1/3">
                  {match.winnerTeamTitle}
                </Typography>
              </Box>
            </Link>
          ))}
        </div>
      </Box>
    </Container>
  );
};
