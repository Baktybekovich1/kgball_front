import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { TournamentsPage } from "./tournaments-ui";

export const tournamentsPageRoute: RouteObject = {
  path: pathKeys.tournaments.root(),
  element: createElement(TournamentsPage)
};