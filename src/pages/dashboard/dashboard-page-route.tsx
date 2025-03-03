import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { DashboardPage } from "./dashboard-ui";

export const dashboardPageRoute: RouteObject = {
  path: pathKeys.dashboard(),
  element: createElement(DashboardPage)
};