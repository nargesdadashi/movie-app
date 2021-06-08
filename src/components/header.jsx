import React from "react";
import { AppBar, Button, Toolbar, Typography, Link } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { useAuth } from "../services/authProvider";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));

const Header = () => {
  const classes = useStyles();

  const { logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      history.push("/signin");
    } catch {
      console.log("Failed to log out");
    }
  };

  return (
    <React.Fragment>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            Movie App
          </Typography>
          <nav>
            <Link
              variant="button"
              color="textPrimary"
              className={classes.link}
              component={RouterLink}
              to="/"
            >
              Home
            </Link>

            <Link
              variant="button"
              color="textPrimary"
              className={classes.link}
              component={RouterLink}
              to="/profile"
            >
              Profile
            </Link>
          </nav>
          <Button
            href="#"
            color="primary"
            variant="outlined"
            className={classes.link}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};
export default Header;
