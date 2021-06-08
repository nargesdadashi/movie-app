import React, { useEffect, useState } from "react";

import Header from "./header";
import Explore from "./explore";
import MovieCard from "./movieCard";
import Profile from "./profile";
import Result from "./result";
import Genre from "./genre";
import MovieDetail from "./movieDetail";

import { Switch, Route } from "react-router-dom";

import { List, CssBaseline, Paper, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useAuth } from "../services/authProvider";

import { getLists } from "../services/dbRequests";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  main: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  paperListCountainer: {
    maxHeight: "70vh",
    overflow: "auto",
    position: "relative",
    margin: theme.spacing(1.5),
  },
  paperTitle: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: "#fafafa",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    textAlign: "center",
    lineHeight: theme.spacing(0.3),
  },
  lists: {
    display: "flex",
    flexDirection: "column",
  },
}));

export const UserLists = React.createContext();

const Home = () => {
  const classes = useStyles();
  const [watchedList, setWatchedList] = useState([]);
  const [toWatchList, setToWatchList] = useState([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    let dbRef = getLists(currentUser.uid);
    try {
      dbRef.on("value", (snapshot) => {
        let watched = [];
        let toWatch = [];
        const vals = snapshot.val();
        if (vals.towatch) {
          Object.values(vals.towatch).forEach((snap) => {
            toWatch.push(snap);
          });
        }
        if (vals.watched) {
          Object.values(vals.watched).forEach((snap) => {
            watched.push(snap);
          });
        }
        setToWatchList(toWatch);
        setWatchedList(watched);
      });
    } catch (error) {
      console.log(error.message);
    }
    return () => {
      dbRef.off();
    };
  }, [currentUser.uid]);

  return (
    <UserLists.Provider value={{ watched: watchedList, towatch: toWatchList }}>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <CssBaseline />
        <Header />
        <Grid
          container
          wrap="wrap"
          direction="row"
          justify="space-around"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={9}>
            <Switch>
              <Route
                path="/"
                exact
                render={(props) => (
                  <Explore
                    {...props}
                    toWatchList={toWatchList}
                    watchedList={watchedList}
                  />
                )}
              />
              <Route exact path="/profile" component={Profile} />
              <Route
                exact
                path="/result/:searchedText/:page"
                component={Result}
              />
              <Route exact path="/genre/:genreName/:page" component={Genre} />
              <Route exact path="/movie/:id" component={MovieDetail} />
            </Switch>
          </Grid>
          <Grid item xs={12} md={3} className={classes.lists}>
            <Paper className={classes.paperListCountainer}>
              <Typography
                variant="h6"
                className={classes.paperTitle}
                gutterBottom
              >
                To watch list
              </Typography>
              <List>
                {toWatchList.map((movieId) => (
                  <MovieCard toWatchList={true} key={movieId} id={movieId} />
                ))}
              </List>
            </Paper>
            <Paper className={classes.paperListCountainer}>
              <Typography
                variant="h6"
                className={classes.paperTitle}
                gutterBottom
              >
                Watched list
              </Typography>

              <List>
                {watchedList.map((movieId) => (
                  <MovieCard watchedList={true} key={movieId} id={movieId} />
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </UserLists.Provider>
  );
};

export default Home;
