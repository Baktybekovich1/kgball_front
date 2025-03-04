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
    <footer className="mt-auto bg-[#5640C9] py-6 border-t border-gray-700 text-white">
      <Container className="max-w-[1440px]">
        <Box className="flex justify-between">
          <Typography
            component={Link}
            to="/"
            sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white', textDecoration: 'none' }}
          >
            KYRGYZBALL
          </Typography>
          {isAuthenticated ? (
            <Button onClick={handleLogout} className="bg-white p-2 text-black font-semibold rounded-lg transition">
              Выйти
            </Button>
          ) : (
            <Link 
              to="/login" 
              className="bg-white p-2 text-black font-semibold rounded-lg transition"
            >
              Войти
            </Link>
          )}
        </Box>
      </Container>
    </footer>
  );
};
