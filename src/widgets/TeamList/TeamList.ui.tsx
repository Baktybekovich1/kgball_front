import React from "react";
import { Link } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { Card, CardContent, Typography } from "@mui/material";
import defaultTeam from "~shared/assets/img/defaultTeam.webp";

interface Team {
  id: number;
  title: string;
  points: number;
  goals: [];
  logo: string;
}

interface TeamsListProps {
  teams: Team[];
  viewMode: "cards" | "table";
}
export const TeamsList: React.FC<TeamsListProps> = ({ teams, viewMode }) => {
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points === a.points) {
      return b.goals.length - a.goals.length;
    }
    return b.points - a.points;
  });

  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 p-2">
        {sortedTeams.map((team) => (
          <Link
            to={pathKeys.teams.bySlug(String(team.id))}
            key={team.id}
            className="flex flex-col items-center gap-4 p-4"
          >
            <div>
              <img src={team.logo || defaultTeam} alt={team.title} className="w-40 h-40" />
              <CardContent className="text-center">
                <Typography variant="h6" className="font-semibold">
                  {team.title}
                </Typography>
              </CardContent>
            </div>
          </Link>
        ))}
      </div>
    );
  } else {
    return (
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 p-2 text-left">Команда</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team, index) => (
            <tr key={team.id} className="border-b">
              <td className="p-2">
                <div className="grid grid-cols-3 items-center gap-4 max-md:flex max-md:justify-between max-md:items-start">
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-bold text-right">{index + 1}.</div>
                    <img
                      src={team.logo || defaultTeam}
                      alt={team.title}
                      className="w-12 h-12 rounded-full"
                    />
                    <Typography>{team.title}</Typography>
                  </div>

                  <div className="flex flex-col text-sm max-md:hidden">
                    <Typography>Всего голов: {team.goals.length}</Typography>
                    <Typography>Всего очков: {team.points}</Typography>
                  </div>

                  <Link
                    className="text-blue hover:underline text-right"
                    to={pathKeys.teams.bySlug(String(team.id))}
                  >
                    Подробнее
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};
