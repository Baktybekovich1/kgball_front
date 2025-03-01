import { Container } from '@mui/material';
import { HomeSwiper } from '~widgets/homeSwiper';

export const HomePage: React.FC = () => {
  return (
    <Container className="max-w-[1440px] mb-10">
      <HomeSwiper />
    </Container>
  );
};

export default HomePage;
