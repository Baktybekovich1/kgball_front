import { Container } from '@mui/material';
import { HomeSwiper } from '~widgets/homeSwiper';
import { BestPlayers } from '~widgets/bestPlayers'
import { News } from '~widgets/news';

export const HomePage: React.FC = () => {
  return (
    <Container className="max-w-[1440px] mb-10">
      <HomeSwiper />
      <News />
      <BestPlayers />
    </Container>
  );
};

export default HomePage;
