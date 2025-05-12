import { getSubDomain } from "Functions";
import NotPaidDashboard from "Pages/DashboardPage/NotPaidDashboard";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const { isAuth, token, user } = useSelector((state) => state.auth);
  const { hasPaid } = useSelector((state) => state.settings);
  const subDomain = getSubDomain();
  return (
    <Route
      {...rest}
      render={(props) => {
        //token from state

        if (!isAuth) {
          // not logged in so redirect to login page with the return url

          return <Redirect to="/login" />;
        }

        if (isAuth && user && user.role === "super-admin") {
          return <Redirect to="/admin/dashboard" />;
        }
        if(subDomain && !hasPaid) {
          return (
            <NotPaidDashboard hasPaid={false} />
          )
        }
        // if (isAuth && user && user.role !== "super-admin") {
        //   return <Redirect to="/dashboard" />;
        // }


        // authorised so return component
        return <Component {...props} />;
      }}
    />
  );
};
export default PrivateRoute;
