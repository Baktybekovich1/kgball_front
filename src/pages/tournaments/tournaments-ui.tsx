import React, { useState, useEffect } from "react";
import { Container, Paper, CircularProgress, Typography, Box } from "@mui/material";
import { pathKeys } from "~shared/lib/react-router";
import { Link } from "react-router-dom";
import { apiClient } from "~shared/lib/api";

export const TournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.get("api/tourneys")
      .then(response => {
        console.log("API Response:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setTournaments(response.data);
        } else {
          setError("Некорректный формат данных от сервера");
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("API Error:", error);
        setError("Ошибка загрузки списка турниров");
        setLoading(false);
      });
  }, []);

  if (loading) return <Box className="flex justify-center items-center h-64"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="max-w-[1440px] mb-10">
      <div className="text-center mb-6">
        <Typography variant="h4" fontWeight="bold" className="text-blue-900 mb-2">
          Турниры
        </Typography>
        <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full mb-3"></div>
        <Typography variant="body2" className="text-gray-600">
          Прошедшие турниры и результаты
        </Typography>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournaments.map((tournament, index) => (
          <Link 
            className="w-full group" 
            to={pathKeys.tournaments.bySlug(String(tournament.id))} 
            key={index}
          >
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                boxShadow: 2, 
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                  borderColor: "#3b82f6"
                }
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: "bold",
                    color: "#1e40af",
                    fontSize: "1rem",
                    lineHeight: 1.2
                  }}
                >
                  {tournament.title}
                </Typography>
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  {index + 1}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-lg mb-3">
                <Typography variant="body2" className="flex items-center gap-2 text-gray-700">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <strong>Дата:</strong> {tournament.date}
                </Typography>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-2 rounded-lg text-center">
                  <Typography variant="caption" className="text-green-700 font-semibold block mb-1">
                    Матчи
                  </Typography>
                  <Typography variant="h6" className="text-green-800 font-bold text-lg">
                    {tournament.games.length}
                  </Typography>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-2 rounded-lg text-center">
                  <Typography variant="caption" className="text-purple-700 font-semibold block mb-1">
                    Команды
                  </Typography>
                  <Typography variant="h6" className="text-purple-800 font-bold text-lg">
                    {tournament.teamsSum}
                  </Typography>
                </div>
              </div>
              
              <div className="text-center">
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                  Подробнее →
                </span>
              </div>
            </Paper>
          </Link>
        ))}
      </div>
    </Container>
  );
};

