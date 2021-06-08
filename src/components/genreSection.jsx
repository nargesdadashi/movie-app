import React, { useEffect, useState, useContext } from "react";
import instance from "../services/tmdbAPI";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import MovieCard from "./movieCard";
import { UserLists } from "./home";

export const fetchData = async (id) => {
  const result = await instance.get("discover/movie", {
    params: {
      language: "en-US",
      api_key: process.env.REACT_APP_TMDB_API_KEY,
      sort_by: "popularity.desc",
      with_genres: id,
    },
  });
  return result;
};

const useStyles = makeStyles((theme) => ({
  seeMore: {
    textAlign: "end",
  },

  list: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
}));

const GenreSection = ({ id, name }) => {
  const [movies, setMovies] = useState([]);
  const classes = useStyles();

  const userLists = useContext(UserLists);

  useEffect(() => {
    try {
      fetchData(id).then((res) => {
        const result = res.data.results.filter(
          (m) =>
            !userLists.watched.includes(m.id) &&
            !userLists.towatch.includes(m.id)
        );
        setMovies(result.slice(0, 3));
      });
    } catch (err) {
      console.log(err);
    }
    return () => {
      setMovies([]);
    };
  }, [id, userLists]);

  return (
    <Grid container className={classes.list} alignItems="flex-end">
      {movies.map((movie, i) => (
        <Grid key={`${i}`} item xs={12} md={4}>
          <MovieCard
            key={movie.id}
            id={movie.id}
            data={movie}
            // discover={true}
          />
        </Grid>
      ))}
      <Grid item xs={12} className={classes.seeMore}>
        <Link
          to={{
            pathname: `/genre/${name}/1`,
            state: { id: id },
          }}
        >
          see more
        </Link>
      </Grid>
    </Grid>
  );
};

export default GenreSection;
