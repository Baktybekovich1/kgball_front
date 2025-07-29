import { Container, Button, Box } from '@mui/material';
import { HomeSwiper } from '~widgets/homeSwiper';
import { BestPlayers } from '~widgets/bestPlayers'
import { News } from '~widgets/news';

export const HomePage: React.FC = () => {
  return (
    <Container className="max-w-[1440px] mb-10">
      <Box className="flex flex-col items-center justify-center py-10 mb-8 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl shadow-md">
        <h1 className="text-4xl font-bold mb-2 text-blue-900 text-center">Добро пожаловать в KG Ball League!</h1>
        <p className="text-lg text-gray-700 mb-4 text-center max-w-xl">Следите за последними матчами, лучшими игроками и новостями турнира. Присоединяйтесь к нашему сообществу и будьте в центре событий!</p>
        <Button variant="contained" color="primary" size="large" href="#" sx={{ mt: 2 }}>
          Присоединиться к турниру
        </Button>
      </Box>
      <HomeSwiper />
      <News />
      <BestPlayers />
    </Container>
  );
};

export default HomePage;
