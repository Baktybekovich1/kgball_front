import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { apiClient } from "~shared/lib/api";
import { useDispatch } from 'react-redux';
import { setAuthToken } from '~shared/slices/auth/authSlice'; 
import { useNavigate } from 'react-router-dom';

interface FormData {
  username: string;
  password: string;
}

export const SignInPage: React.FC = () => {
  const {
    register,
    handleSubmit, 
    formState: { errors },
  } = useForm<FormData>();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await apiClient.post('/api/login', data);
      dispatch(setAuthToken(response.data.token));
      navigate('/');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h4" gutterBottom>
          Вход в аккаунт
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
          <TextField
            fullWidth
            label="Имя пользователя"
            margin="normal"
            {...register("username", { required: "Введите имя пользователя" })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            fullWidth
            type="password"
            label="Пароль"
            margin="normal"
            {...register("password", { 
              required: "Введите пароль", 
              minLength: { value: 6, message: "Минимум 6 символов" } 
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Войти
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInPage;
