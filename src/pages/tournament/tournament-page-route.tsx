import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { TournamentPage } from "./tournament-ui";

export const tournamentPageRoute: RouteObject = {
  path: pathKeys.tournaments.root() + ':id',
  element: <TournamentPage />
};