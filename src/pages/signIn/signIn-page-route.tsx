import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import { pathKeys } from "~shared/lib/react-router";
import { SignInPage } from "./signIn-ui";

export const signInPageRoute: RouteObject = {
  path: pathKeys.signIn(),
  element: <SignInPage />
};