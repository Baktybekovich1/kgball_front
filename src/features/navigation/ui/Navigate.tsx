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
  { title: 'Главная', url: '/' },
  { title: 'Игроки', url: '/player/list' },
  { title: 'Команды', url: '/teams' },
  { title: 'Матчи', url: '/matches' },
  { title: 'Турниры', url: '/tournaments' },
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
          KYRGYZBALL
        </Typography>

        {isMobile ? (
          <>
            <IconButton edge="start" onClick={toggleDrawer(true)} sx={{ background: '#2563eb', color: '#fff', p: 1.2, borderRadius: 2, boxShadow: '0 2px 8px rgba(37,99,235,0.15)' }}>
              <MenuIcon sx={{ color: '#fff', fontSize: 32 }} />
            </IconButton>
            <Drawer
              anchor="right"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  background: '#2563eb',
                  color: '#fff',
                  width: 260,
                  p: 0,
                  boxShadow: '0 4px 24px rgba(37,99,235,0.18)'
                }
              }}
            >
              <List sx={{ width: 260, p: 0 }}>
                {listLink.map((item, index) => (
                  <ListItem key={index} onClick={toggleDrawer(false)} sx={{ p: 0 }}>
                    <ListItemText>
                      <Link
                        to={item.url}
                        style={{
                          textDecoration: 'none',
                          color: '#fff',
                          width: '100%',
                          display: 'block',
                          padding: '14px 24px',
                          borderRadius: 0,
                          fontWeight: 500,
                          fontSize: 17,
                          background: location.pathname === item.url ? '#1e40af' : 'transparent',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#3b82f6'}
                        onMouseOut={e => e.currentTarget.style.background = location.pathname === item.url ? '#1e40af' : 'transparent'}
                      >
                        {item.title}
                      </Link>
                    </ListItemText>
                  </ListItem>
                ))}
                {isAuthenticated && (
                  <ListItem onClick={toggleDrawer(false)} sx={{ p: 0 }}>
                    <ListItemText>
                      <Button
                        onClick={handleLogout}
                        sx={{
                          width: '100%',
                          padding: '14px 24px',
                          background: 'rgba(255,255,255,0.12)',
                          color: '#fff',
                          fontWeight: 600,
                          borderRadius: 0,
                          fontSize: 16,
                          boxShadow: 'none',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                          '&:hover': { background: 'rgba(255,255,255,0.22)' }
                        }}
                      >
                        Выйти
                      </Button>
                    </ListItemText>
                  </ListItem>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {listLink.map((item, index) => (
              <Typography
                component={Link}
                to={item.url}
                key={index}
                sx={{
                  textDecoration: 'none',
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: 8,
                  fontWeight: 500,
                  fontSize: 15,
                  background: location.pathname === item.url ? '#1e40af' : '#2563eb',
                  boxShadow: location.pathname === item.url ? '0 2px 8px rgba(30,64,175,0.12)' : 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: '#3b82f6',
                    color: '#fff',
                  },
                }}
              >
                {item.title}
              </Typography>
            ))}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                sx={{
                  marginLeft: '12px',
                  padding: '8px 18px',
                  background: '#f3f4f6',
                  color: '#222',
                  fontWeight: 500,
                  borderRadius: 8,
                  fontSize: 15,
                  border: '1px solid #e0e7ef',
                  boxShadow: 'none',
                  transition: 'all 0.2s',
                  '&:hover': { background: '#e0e7ef' }
                }}
              >
                Выйти
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </div>
  ); 
};
