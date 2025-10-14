import { Container, Typography, ListItem, Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { removeAuthToken } from '~shared/slices/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated); 

  const handleLogout = () => {
    dispatch(removeAuthToken()); 
    navigate('/');
  };

  return (
    <footer className="mt-auto bg-[#2563eb] py-6 text-white">
      <Container className="max-w-[1440px]">
        <Box className="flex justify-between items-center">
          <Typography
            component={Link}
            to="/"
            sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white', textDecoration: 'none', letterSpacing: 1 }}
          >
            KARA-BULAK LEAGUE
          </Typography>
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              sx={{
                background: 'rgba(255,255,255,0.12)',
                color: 'white',
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontSize: 16,
                boxShadow: 'none',
                transition: 'all 0.2s',
                '&:hover': { background: 'rgba(255,255,255,0.22)' }
              }}
            >
              Выйти
            </Button>
          ) : (
            <Link
              to="/login"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: 'white',
                fontWeight: 600,
                borderRadius: 6,
                padding: '8px 24px',
                fontSize: 16,
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: 'none',
                display: 'inline-block',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
              Войти
            </Link>
          )}
        </Box>
      </Container>
    </footer>
  );
};
