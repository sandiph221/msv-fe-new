import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
const AdminRoutes = ({ component: Component, roles, ...rest }) => {
  const { isAuth } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) => {
        //token from state

        if (!isAuth) {
          // not logged in so redirect to login page with the return url
          return <Redirect to='/login' />;
        }

        // authorised so return component
        return <Component {...props} />;
      }}
    />
  );
};

export default AdminRoutes;
