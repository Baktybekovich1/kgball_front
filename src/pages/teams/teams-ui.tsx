// TeamsPage.tsx
import React from "react";
import { Container, Typography } from "@mui/material";
import { TeamsList } from "~widgets/TeamList/TeamList.ui";

export const TeamsPage: React.FC = () => {
  return (
    <Container className="max-w-[1200px] mb-10">
      <Typography variant="h4" fontWeight="bold" mb={6} className="text-blue-900 text-center">
        Таблица команд турнира
      </Typography>
      <TeamsList teams={[]} viewMode="table" />
    </Container>
  );
};
