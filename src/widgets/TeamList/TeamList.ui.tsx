import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { Card, CardContent, Typography, Select, MenuItem, Box, FormControl, InputLabel, Chip } from "@mui/material";
import defaultTeam from "~shared/assets/img/defaultTeam.webp";
import { apiClient } from "~shared/lib/api";

interface Team {
  id: number;
  title: string;
  points: number;
  goals: number;
  assists: number;
  games: number; // API возвращает games вместо matches
  winnerGames: number; // API возвращает winnerGames вместо wins
  loseGames: number; // API возвращает loseGames вместо losses
  logo: string;
  goalsAgainst?: number; // Пропущенные мячи (нужно вычислить)
  goalDifference?: number; // Разница мячей
  draws?: number; // Ничьи (нужно вычислить)
}

interface TeamsListProps {
  teams?: Team[];
  viewMode: "cards" | "table";
}

type SortField = "points" | "games" | "winnerGames" | "loseGames" | "goals" | "assists";

export const TeamsList: React.FC<TeamsListProps> = ({ teams, viewMode }) => {
  const [bestTeamsData, setBestTeamsData] = useState<Team[]>([]);
  const [sortField, setSortField] = useState<SortField>("points");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestTeams = async () => {
      try {
        const response = await apiClient.get("/team/best_teams");
        if (response.data && Array.isArray(response.data)) {
          // Преобразуем данные API в нужный формат
          const teamsWithStats = response.data.map((team: any) => {
            return {
              ...team,
              matches: team.games, // Для совместимости
              wins: team.winnerGames, // Для совместимости
              losses: team.loseGames, // Для совместимости
            };
          });
          setBestTeamsData(teamsWithStats);
        }
      } catch (error) {
        console.error("Error fetching best teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestTeams();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedTeams = [...bestTeamsData].sort((a, b) => {
    const aValue = a[sortField] || 0;
    const bValue = b[sortField] || 0;
    
    if (sortDirection === "desc") {
      return bValue - aValue;
    } else {
      return aValue - bValue;
    }
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕";
    return sortDirection === "desc" ? "↓" : "↑";
  };

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode; highlight?: boolean }> = ({ field, children, highlight = false }) => {
    // Определяем фон в зависимости от поля
    const getBackground = () => {
      switch (field) {
        case 'games': return 'bg-gray-50';
        case 'winnerGames': return 'bg-white';
        case 'loseGames': return 'bg-gray-50';
        case 'goals': return 'bg-white';
        case 'assists': return 'bg-gray-50';
        case 'points': return 'bg-white';
        default: return 'bg-white';
      }
    };

    // Полные названия для десктопа
    const getFullName = () => {
      switch (field) {
        case 'games': return 'Игры';
        case 'winnerGames': return 'Победы';
        case 'loseGames': return 'Поражения';
        case 'goals': return 'Голы';
        case 'assists': return 'Ассисты';
        case 'points': return 'Очки';
        default: return children;
      }
    };

    return (
      <th 
        className={`p-0.5 md:p-3 text-center text-gray-800 font-bold text-xs md:text-base cursor-pointer hover:bg-gray-200 transition-colors ${getBackground()} ${highlight ? 'bg-blue-100' : ''}`}
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center justify-center gap-1">
          <span className="md:hidden">{children}</span>
          <span className="hidden md:inline">{getFullName()}</span>
          <span className="text-xs">{getSortIcon(field)}</span>
        </div>
      </th>
    );
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Typography>Загрузка данных команд...</Typography>
      </Box>
    );
  }

  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 p-2">
        {sortedTeams.map((team) => (
          <Link
            to={pathKeys.teams.bySlug(String(team.id))}
            key={team.id}
            className="block"
            style={{ textDecoration: 'none' }}
          >
            <Card className="bg-white rounded-2xl shadow-lg border border-blue-500 hover:shadow-xl transition-all duration-200 hover:border-blue-600">
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <img src={team.logo || defaultTeam} alt={team.title} className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md" />
                <div className="text-center">
                  <Typography variant="h6" className="font-bold text-blue-900 mb-2">
                    {team.title}
                  </Typography>
                  <div className="flex flex-col gap-2 text-sm text-blue-700">
                    <div className="flex justify-between gap-4">
                      <span>Очки: <strong className="text-lg">{team.points || 0}</strong></span>
                      <span>Голы: <strong>{team.goals || 0}</strong></span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Игры: <strong>{team.games || 0}</strong></span>
                      <span>Победы: <strong className="text-green-600">{team.winnerGames || 0}</strong></span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Поражения: <strong className="text-red-600">{team.loseGames || 0}</strong></span>
                      <span>Ассисты: <strong className="text-blue-600">{team.assists || 0}</strong></span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg  overflow-hidden">
      {/* Единый заголовок для всех версий */}
      
      
      {/* Единая таблица для всех устройств */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-1 md:p-3 text-left text-gray-800 font-bold text-xs md:text-base bg-white">
                Клуб
              </th>
              <SortableHeader field="games">И</SortableHeader>
              <SortableHeader field="winnerGames">В</SortableHeader>
              <SortableHeader field="loseGames">П</SortableHeader>
              <SortableHeader field="goals">Г</SortableHeader>
              <SortableHeader field="assists">А</SortableHeader>
              <SortableHeader field="points" highlight={true}>О</SortableHeader>
              <th className="p-1 md:p-3 text-center text-gray-800 font-bold text-xs md:text-base bg-white">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr key={team.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="p-1 md:p-3 bg-white">
                  <div className="flex items-center gap-1 md:gap-3">
                    <span className="text-gray-500 font-bold text-xs md:text-sm w-2 md:w-6">{index + 1}</span>
                    <img
                      src={team.logo || defaultTeam}
                      alt={team.title}
                      className="w-4 h-4 md:w-8 md:h-8 rounded-full"
                    />
                    <span className="text-gray-900 font-medium text-xs md:text-base truncate max-w-12 md:max-w-none">{team.title}</span>
                  </div>
                </td>
                <td className="p-0.5 md:p-3 text-center bg-gray-50">
                  <span className="text-gray-700 font-semibold text-xs md:text-sm">{team.games || 0}</span>
                </td>
                <td className="p-0.5 md:p-3 text-center bg-white">
                  <span className="text-green-600 font-semibold text-xs md:text-sm">{team.winnerGames || 0}</span>
                </td>
                <td className="p-0.5 md:p-3 text-center bg-gray-50">
                  <span className="text-red-600 font-semibold text-xs md:text-sm">{team.loseGames || 0}</span>
                </td>
                <td className="p-0.5 md:p-3 text-center bg-white">
                  <span className="text-blue-600 font-semibold text-xs md:text-sm">{team.goals || 0}</span>
                </td>
                <td className="p-0.5 md:p-3 text-center bg-gray-50">
                  <span className="text-purple-600 font-semibold text-xs md:text-sm">{team.assists || 0}</span>
                </td>
                <td className="p-0.5 md:p-3 text-center bg-white">
                  <span className="bg-blue-100 text-blue-800 font-bold px-0.5 py-0.5 md:px-2 md:py-1 rounded text-xs md:text-sm">
                    {team.points || 0}
                  </span>
                </td>
                <td className="p-0.5 md:p-3 text-center bg-gray-50">
                  <Link
                    to={pathKeys.teams.bySlug(String(team.id))}
                    className="inline-flex items-center px-0.5 py-0.5 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 hover:text-blue-800 transition-colors"
                  >
                    Подробнее
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
