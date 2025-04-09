import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { PlayerTransferPage } from "./playerTransfer-ui";

export const playerTransferPagePageRoute: RouteObject = {
  path: pathKeys.dashboard.playerTransfer(), 
  element: createElement(PlayerTransferPage)
};