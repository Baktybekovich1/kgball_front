import { Container, IconButton, Button, Drawer, Box, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { apiClient } from "~shared/lib/api";
import { DashboardContent } from "~widgets/DashboardContent";
import { pathKeys } from "~shared/lib/react-router";

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const storedTab = localStorage.getItem("activeTab");
    return storedTab ? storedTab : "teams";
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [leagues, setLeagues] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => { 
    setLoading(true);
    if (activeTab === "teams") {
      apiClient.get("/api/teams")
        .then(response => {
          if (response.data && Array.isArray(response.data)) {
            setTeams(response.data);
          } else {
            setError("Некорректный формат данных от сервера");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Ошибка загрузки списка команд");
          setLoading(false);
        });
    } else if (activeTab === "tournaments") {
      apiClient.get("/api/tourneys")
        .then(response => {
          if (response.data && Array.isArray(response.data)) {
            setTournaments(response.data);
          } else {
            setError("Некорректный формат данных от сервера");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Ошибка загрузки списка турниров");
          setLoading(false);
        }); 
    } else if (activeTab === "leagues") { 
      apiClient.get("/api/ligas")
        .then(response => {
          if (response.data && Array.isArray(response.data)) {
            setLeagues(response.data);
          } else {
            setError("Некорректный формат данных от сервера");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Ошибка загрузки списка лиг");
          setLoading(false);
        });
    }
  }, [activeTab]);

  return (
    <Container className="max-w-[1440px] px-4 py-2">
      <IconButton 
        className="mb-4" 
        onClick={() => setIsSidebarOpen(true)} 
        sx={{ borderRadius: 2 }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>
  
      <Drawer
        anchor="left"
        BackdropProps={{ invisible: true }}
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      >
        <Box sx={{ width: 300, p: 3, bgcolor: "#f9f9f9", height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              KYRGYZBALL
            </Typography>
            <IconButton 
              onClick={() => setIsSidebarOpen(false)} 
              sx={{ color: "#333" }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>×</Typography>
            </IconButton>
          </Box>
  
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab("teams")}>
                <Typography variant="body1">Команды</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab("leagues")}>
                <Typography variant="body1">Лиги</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab("tournaments")}>
                <Typography variant="body1">Турниры</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to={pathKeys.dashboard.playerTransfer()}>
                <Typography variant="body1">Переместить игрока</Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mt: 3 }}>
              <ListItemButton component={Link} to="/">
                <Typography variant="body1" color="text.secondary">На главную</Typography>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
  
      <DashboardContent 
        activeTab={activeTab}
        loading={loading}
        setLoading={setLoading}
        error={error}
        teams={teams}
        tournaments={tournaments}
        setTournaments={setTournaments}
        leagues={leagues}
        setTeams={setTeams}
        setActiveTab={setActiveTab}
      />
    </Container>
  );
  
};

export default DashboardPage;
