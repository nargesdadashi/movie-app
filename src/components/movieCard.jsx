import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  Typography,
  CssBaseline,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";

import React, { useEffect, useState, useContext } from "react";

import instance from "../services/tmdbAPI";

import { useHistory } from "react-router-dom";
import {
  pushToToWatchList,
  pushToWatchedList,
  removeFromWatchedList,
  removeFromToWatchList,
} from "../services/dbRequests";

import { useAuth } from "../services/authProvider";

import { UserLists } from "./home";

const useStyles = makeStyles((theme) => ({
  actionArea: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  cardMedia: {
    width: 80,
    height: 120,
  },
  cardGrid: {
    margin: theme.spacing(2),
  },
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

const CardStates = {
  ToWatch: "toWatch",
  Watched: "watched",
  None: "none",
};

const findCardState = (userLists, id) => {
  if (userLists.watched.includes(id)) return CardStates.Watched;
  if (userLists.towatch.includes(id)) return CardStates.ToWatch;

  return CardStates.None;
};

const MovieCard = (props) => {
  const userLists = useContext(UserLists);
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const history = useHistory();
  const [rating, setRating] = useState(1);
  const [poster, setPoster] = useState();
  const [listState, setListState] = useState("none");

  const { currentUser } = useAuth();

  const addToWatch = () => {
    pushToToWatchList(currentUser.uid, props.id);
  };
  const addToWatchAgain = () => {
    pushToToWatchList(currentUser.uid, props.id);
    removeFromWatchedList(currentUser.uid, props.id);
  };
  const addWatched = () => {
    pushToWatchedList(currentUser.uid, props.id);
    removeFromToWatchList(currentUser.uid, props.id);
  };

  const handleClickOnMovie = () => {
    history.push(`/movie/${props.id}`);
  };

  useEffect(() => {
    const listState = findCardState(userLists, props.id);
    setListState(listState);

    if (props.data) {
      setTitle(props.data.original_title);
      setRating(props.data.vote_average / 2);
      setPoster(props.data.poster_path);
    } else {
      try {
        fetchData(props.id).then((res) => {
          setTitle(res.data.original_title);
          setRating(res.data.vote_average / 2);
          setPoster(res.data.poster_path);
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [userLists, props.id, props.data]);

  return (
    <div>
      <CssBaseline />

      <Grid item xs={12} className={classes.cardGrid}>
        <Card>
          <CardActionArea
            className={classes.actionArea}
            component="a"
            onClick={handleClickOnMovie}
          >
            {poster && (
              <CardMedia
                component="img"
                className={classes.cardMedia}
                image={`https://image.tmdb.org/t/p/w500${poster}`}
                title="poster"
              />
            )}
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                {title}
              </Typography>
              <Rating name="size-small" value={rating} size="small" />
            </CardContent>
          </CardActionArea>

          {listState === CardStates.ToWatch && (
            <CardActions>
              <Button size="small" color="primary" onClick={addWatched}>
                Watched
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={() => removeFromToWatchList(currentUser.uid, props.id)}
              >
                Remove
              </Button>
            </CardActions>
          )}
          {listState === CardStates.Watched && (
            <CardActions>
              <Button size="small" color="primary" onClick={addToWatchAgain}>
                Add To Watch
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={() => removeFromWatchedList(currentUser.uid, props.id)}
              >
                Remove
              </Button>
            </CardActions>
          )}
          {listState === CardStates.None && (
            <CardActions>
              <Button size="small" color="primary" onClick={addToWatch}>
                To Watch
              </Button>
              <Button size="small" color="primary" onClick={addWatched}>
                Watched
              </Button>
            </CardActions>
          )}
        </Card>
      </Grid>
    </div>
  );
};

export default MovieCard;
