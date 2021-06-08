import { Paper, Typography, Grid, Chip, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import instance from "../services/tmdbAPI";
import Rating from "@material-ui/lab/Rating";

import { UserLists } from "./home";

import { useAuth } from "../services/authProvider";

import {
  pushToToWatchList,
  pushToWatchedList,
  removeFromWatchedList,
  removeFromToWatchList,
} from "../services/dbRequests";

const useStyles = makeStyles((theme) => ({
  poster: { width: "100%" },
  paper: { padding: theme.spacing(4), marginTop: theme.spacing(1.5) },
  overview: { marginTop: theme.spacing(3) },
  buttons: { marginTop: "1em", display: "block" },
}));

export const fetchData = async (id) => {
  const result = await instance.get(`movie/${id}`, {
    params: {
      language: "en-US",
      api_key: process.env.REACT_APP_TMDB_API_KEY,
    },
  });
  return result;
};

const MovieDetail = () => {
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [movie, setMovie] = useState({});

  const userLists = useContext(UserLists);

  const { currentUser } = useAuth();

  const addToWatch = () => {
    pushToToWatchList(currentUser.uid, parseInt(id));
  };
  const addToWatchAgain = () => {
    pushToToWatchList(currentUser.uid, parseInt(id));
    removeFromWatchedList(currentUser.uid, parseInt(id));
  };
  const addWatched = () => {
    pushToWatchedList(currentUser.uid, parseInt(id));
    removeFromToWatchList(currentUser.uid, parseInt(id));
  };

  const handleGenreClick = (id, name) => {
    history.push({
      pathname: `/genre/${name}/1`,
      state: { id: id },
    });
  };

  useEffect(() => {
    try {
      fetchData(id).then((res) => {
        setMovie(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  }, [id, userLists]);

  return (
    <Grid container justify="center">
      <Grid item xs={11} md={11} lg={10}>
        <Paper className={classes.paper}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5} lg={4}>
              <img
                alt="movie poster"
                className={classes.poster}
                src={
                  movie?.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
              <Typography gutterBottom variant="h6">
                {movie?.original_title}
              </Typography>
              <span>
                <Rating
                  name="size-small"
                  value={movie?.vote_average / 2}
                  size="small"
                />
                {movie?.vote_average / 2}({movie?.vote_count})
              </span>
              <Typography variant="body2" gutterBottom>
                language : {movie?.original_language}
              </Typography>
              <Typography variant="body2" gutterBottom>
                production country :
                {(movie?.production_countries ?? [])[0]?.name ?? ""}
              </Typography>
              <Typography variant="body2" gutterBottom>
                production company:
                {(movie?.production_companies ?? [])[0]?.name ?? ""}
              </Typography>

              {movie?.genres
                ? movie?.genres.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      component="a"
                      clickable
                      variant="outlined"
                      onClick={() => handleGenreClick(genre.id, genre.name)}
                    />
                  ))
                : null}
              <Typography
                gutterBottom
                variant="subtitle2"
                className={classes.overview}
              >
                Overview:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {movie?.overview}
              </Typography>

              {userLists.towatch.includes(parseInt(id)) && (
                <div>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    className={classes.buttons}
                    onClick={addWatched}
                  >
                    Watched
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    className={classes.buttons}
                    onClick={() =>
                      removeFromToWatchList(currentUser.uid, parseInt(id))
                    }
                  >
                    Remove From To Watch
                  </Button>
                </div>
              )}
              {userLists.watched.includes(parseInt(id)) && (
                <div>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    className={classes.buttons}
                    onClick={addToWatchAgain}
                  >
                    Add To Watch
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    className={classes.buttons}
                    onClick={() =>
                      removeFromWatchedList(currentUser.uid, parseInt(id))
                    }
                  >
                    Remove From Watched
                  </Button>
                </div>
              )}
              {!userLists.watched.includes(parseInt(id)) &&
                !userLists.towatch.includes(parseInt(id)) && (
                  <div>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      className={classes.buttons}
                      onClick={addToWatch}
                    >
                      To Watch
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      className={classes.buttons}
                      onClick={addWatched}
                    >
                      Watched
                    </Button>
                  </div>
                )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MovieDetail;
