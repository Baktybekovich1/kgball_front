import { Container, IconButton, Button, Drawer, Box, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { apiClient } from "~shared/lib/api";
import { DashboardContent } from "~widgets/DashboardContent";

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
    <Container className="max-w-[1440px]">
      <IconButton className="mb-2" onClick={() => setIsSidebarOpen(true)}>
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        BackdropProps={{ invisible: true }} 
        open={isSidebarOpen}
        onClick={() => setIsSidebarOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Typography variant="h6">KYRGYZBALL</Typography>
            <Button  
              onClick={() => setIsSidebarOpen(false)} 
              sx={{
                color: 'black', 
                fontSize: '20px', 
                fontWeight: 'bold', 
                padding: '0', 
                '&:hover': {
                  cursor: 'pointer',
                }
              }}
            >
              X
            </Button>
          </Box>

          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">Home</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab("teams")}>Команды</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab("leagues")}>Лиги</ListItemButton> 
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab("tournaments")}>Турниры</ListItemButton>
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
