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
          sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'black', textDecoration: 'none' }}
        >
          KYRGYZBALL
        </Typography>

        {isMobile ? (
          <>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon sx={{ color: 'black' }} />
            </IconButton>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
              <List sx={{ width: 250 }}>
                {listLink.map((item, index) => (
                  <ListItem key={index} onClick={toggleDrawer(false)}>
                    <ListItemText>
                      <Link
                        to={item.url}
                        style={{
                          textDecoration: 'none',
                          color: 'black',
                          width: '100%',
                          display: 'block',
                          padding: '8px 16px',
                          backgroundColor: location.pathname === item.url ? '#f0f0f0' : 'white',
                        }}
                      >
                        {item.title}
                      </Link>
                    </ListItemText>
                  </ListItem>
                ))}
                {isAuthenticated && (
                  <ListItem onClick={toggleDrawer(false)}>
                    <ListItemText>
                      <Button
                        onClick={handleLogout}
                        sx={{ padding: '8px 18px', color: 'black' }}
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            {listLink.map((item, index) => (
              <Typography
                component={Link}
                to={item.url}
                key={index}
                sx={{
                  textDecoration: 'none',
                  color: 'black',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid #E4E4E7',
                  transition: 'all 0.3s ease',
                  backgroundColor: location.pathname === item.url ? 'primary.main' : 'white',
                  color: location.pathname === item.url ? 'white' : 'black',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                {item.title}
              </Typography>
            ))}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                className="bg-white p-2 text-black font-semibold rounded-lg transition"
                sx={{ marginLeft: '20px' }}
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
