import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { PlayersPage } from "./players-ui";

export const playersPageRoute: RouteObject = {
  path: pathKeys.players.root() + ':id?',
  element: createElement(PlayersPage),
};
