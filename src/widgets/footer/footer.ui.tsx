import { Container, Typography, List, ListItem, Box, IconButton } from '@mui/material';
import { InstagramIcon } from '~shared/assets/icons/InstagramIcon';
import { WhatsappIcon } from '~shared/assets/icons/whatsappIcon';
import { GmailIcon } from '~shared/assets/icons/GmailIcon';
import { Link } from 'react-router-dom';
import { ArrowIcon } from '~shared/assets/icons/ArrowIcon';

export const Footer: React.FC = () => {

  interface Contact {
    id: number;
    icon: JSX.Element;
    text: string;
    link: string;
  }

  const contacts: Contact[] = [
    {
      id: 1,
      icon: <WhatsappIcon />,
      text: "+996 333 333 333",
      link: "https://wa.me/996333333333",
    },
    {
      id: 2,
      icon: <InstagramIcon />,
      text: "kyrgyzBall.kg",
      link: "https://www.instagram.com/kyrgyzBall",
    },
    {
      id: 3,
      icon: <GmailIcon />,
      text: "kyrgyzBall@gmail.col",
      link: "mailto:kyrgyzBall.kg@gmail.com",
    },
  ];
  

  return (
    <footer className="mt-auto bg-[#5640C9] py-6 border-t border-gray-700 text-white">
      <Container className='max-w-[1440px]'>
        <Box>
          <Typography
            component={Link}
            to="/"
            sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white', textDecoration: 'none' }}
          >
            KYRGYZBALL
          </Typography>
        </Box>
        
        <div className="flex max-md:flex-col max-md:gap-4 gap-6 mt-4">
          {contacts.map((contact: Contact) => (
            <ListItem sx={{ width: 'auto', p: 0 }}>
                <a
                  key={contact.id}
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <div className="cursor-pointer flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    {contact.icon}
                    <p className="max-md:text-base text-xl font-medium text-white">
                      {contact.text}
                    </p>
                  </div>
                </div>
                </a>
              </ListItem>
            ))}
        </div>
      </Container>
    </footer>
  );
};
