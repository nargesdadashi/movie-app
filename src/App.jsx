import Signup from "./components/signup";
import Signin from "./components/signin";

import PrivateRoute from "./components/privateRoute";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/home";
import ForgotPassword from "./components/forgotPassword";
import { useAuth } from "./services/authProvider";

function App() {
  const { currentUser } = useAuth();
  return (
    <Switch>
      <Route
        exact
        path="/signup"
        render={(props) => {
          return !currentUser ? <Signup /> : <Redirect to="/" />;
        }}
      />
      <Route
        exact
        path="/signin"
        render={(props) => {
          return !currentUser ? <Signin /> : <Redirect to="/" />;
        }}
      />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <PrivateRoute path="/" component={Home} />
    </Switch>
  );
}

export default App;
