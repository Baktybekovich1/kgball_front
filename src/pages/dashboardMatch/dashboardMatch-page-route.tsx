import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { DashboardMatchPage } from "./dashboardMatch-ui";

export const dashboardMatchPageRoute: RouteObject = {
  path: pathKeys.dashboard.dashboardMatch(':id'),
  element: <DashboardMatchPage />
};