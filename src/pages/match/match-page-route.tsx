import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { MatchPage } from "./match-ui";

export const matchPageRoute: RouteObject = {
  path: pathKeys.matches.root() + ':id',
  element: <MatchPage />
};