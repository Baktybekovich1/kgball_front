import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { MatchesPage } from "./matches-ui";

export const matchesPageRoute: RouteObject = {
  path: pathKeys.matches.root(),
  element: createElement(MatchesPage)
};