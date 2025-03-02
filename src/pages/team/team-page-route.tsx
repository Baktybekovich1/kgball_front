import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { TeamPage } from "./team-ui";

export const teamPageRoute: RouteObject = {
  path: pathKeys.teams.root() + ':id',
  element: <TeamPage />
};