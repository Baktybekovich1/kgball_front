import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { PlayerPage } from "./player-ui";

export const playerPageRoute: RouteObject = 
{
  path: pathKeys.players.root() + ':id',  
  element: <PlayerPage />,
}

