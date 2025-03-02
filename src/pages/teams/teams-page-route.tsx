import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { TeamsPage } from "./teams-ui";

export const teamsPageRoute: RouteObject = {
  path: pathKeys.teams.root(),
  element: createElement(TeamsPage)
};