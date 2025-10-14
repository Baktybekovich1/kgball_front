import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  Button,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { pathKeys } from '~shared/lib/react-router';
import { useEffect } from 'react';
import { removeAuthToken } from '~shared/slices/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const listLink = [
  { title: 'Главная', url: '/', icon: '🏠' },
  { title: 'Игроки', url: '/player/list', icon: '👥' },
  { title: 'Команды', url: '/teams', icon: '🏆' },
  { title: 'Матчи', url: '/matches', icon: '⚽' },
  { title: 'Турниры', url: '/tournaments', icon: '🏅' },
];

export const Navigate: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [open, setOpen] = useState(false);
  const location = useLocation(); 

  const toggleDrawer = (state: boolean) => () => setOpen(state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated); 

  const handleLogout = () => {
    dispatch(removeAuthToken()); 
    navigate('/');
  };

  return (
    <div className="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          component={Link}
          to={pathKeys.home()}
          sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#2563eb', textDecoration: 'none', letterSpacing: 1 }}
        >
          KARA-BULAK LEAGUE
        </Typography>

        {isMobile ? (
          <>
            <IconButton 
              edge="start" 
              onClick={toggleDrawer(true)} 
              sx={{ 
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', 
                color: '#fff', 
                p: 1.5, 
                borderRadius: 3, 
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(37,99,235,0.4)'
                }
              }}
            >
              <MenuIcon sx={{ color: '#fff', fontSize: 28 }} />
            </IconButton>
            <Drawer
              anchor="right"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  color: '#fff',
                  width: 280,
                  p: 0,
                  boxShadow: '0 8px 32px rgba(37,99,235,0.25)'
                }
              }}
            >
              <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', textAlign: 'center' }}>
                  Меню
                </Typography>
              </Box>
              <List sx={{ width: 280, p: 0 }}>
                {listLink.map((item, index) => (
                  <ListItem key={index} onClick={toggleDrawer(false)} sx={{ p: 0 }}>
                    <ListItemText>
                      <Link
                        to={item.url}
                        style={{
                          textDecoration: 'none',
                          color: '#fff',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 24px',
                          borderRadius: 0,
                          fontWeight: 600,
                          fontSize: 16,
                          background: location.pathname === item.url 
                            ? 'rgba(255,255,255,0.2)' 
                            : 'transparent',
                          transition: 'all 0.3s ease',
                          borderLeft: location.pathname === item.url ? '4px solid #fff' : '4px solid transparent'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        onMouseOut={e => e.currentTarget.style.background = location.pathname === item.url ? 'rgba(255,255,255,0.2)' : 'transparent'}
                      >
                        <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
                        {item.title}
                      </Link>
                    </ListItemText>
                  </ListItem>
                ))}
                {isAuthenticated && (
                  <ListItem onClick={toggleDrawer(false)} sx={{ p: 0, mt: 2 }}>
                    <ListItemText>
                      <Button
                        onClick={handleLogout}
                        sx={{
                          width: '100%',
                          padding: '16px 24px',
                          background: 'rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontWeight: 600,
                          borderRadius: 0,
                          fontSize: 16,
                          boxShadow: 'none',
                          textAlign: 'left',
                          transition: 'all 0.3s ease',
                          borderLeft: '4px solid transparent',
                          '&:hover': { 
                            background: 'rgba(255,255,255,0.2)',
                            borderLeft: '4px solid #fff'
                          }
                        }}
                      >
                        <span style={{ marginRight: '12px', fontSize: '18px' }}>🚪</span>
                        Выйти
                      </Button>
                    </ListItemText>
                  </ListItem>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {listLink.map((item, index) => (
              <Button
                component={Link}
                to={item.url}
                key={index}
                variant={location.pathname === item.url ? "contained" : "outlined"}
                sx={{
                  minWidth: { xs: 100, sm: 120 },
                  fontWeight: 600,
                  borderRadius: 3,
                  fontSize: { xs: 13, sm: 14 },
                  px: 2.5,
                  py: 1,
                  background: location.pathname === item.url 
                    ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' 
                    : '#2563eb',
                  color: '#fff',
                  borderColor: location.pathname === item.url ? '#2563eb' : '#2563eb',
                  borderWidth: 2,
                  boxShadow: location.pathname === item.url 
                    ? '0 4px 12px rgba(37, 99, 235, 0.3)' 
                    : '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transform: location.pathname === item.url ? 'translateY(-1px)' : 'translateY(0)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: location.pathname === item.url 
                      ? 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)'
                      : 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
                    color: '#fff',
                    borderColor: location.pathname === item.url ? '#1e40af' : '#1e40af',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(37, 99, 235, 0.2)'
                  }
                }}
              >
                <span className="mr-1.5">{item.icon}</span>
                <span className="hidden sm:inline">{item.title}</span>
                <span className="sm:hidden">{item.title.split(' ')[0]}</span>
              </Button>
            ))}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="outlined"
                sx={{
                  marginLeft: '8px',
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 3,
                  fontSize: 14,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  borderWidth: 2,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                🚪 Выйти
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </div>
  ); 
};
