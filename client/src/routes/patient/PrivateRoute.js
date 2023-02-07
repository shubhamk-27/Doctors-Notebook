import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.uid.includes("moRNTinwFYWB2MZrxBew9tdCbKH2")) {
        setIsAdmin(true);
      }
    }
  }, [currentUser]);

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          isAdmin ? (
            <Redirect to="/admin" />
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}

export default PrivateRoute;
