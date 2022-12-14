import React from "react";
import { Route } from "react-router-dom";

export default function RouteWithLayout({ layout, component, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={(props:any) =>
        React.createElement(
          layout,
          props,
          React.createElement(component, props)
        )
      }
    />
  );
}
