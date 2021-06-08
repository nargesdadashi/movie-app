import { useParams, useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import instance from "../services/tmdbAPI";

import Grid from "@material-ui/core/Grid";

import Pagination from "@material-ui/lab/Pagination";
import MovieCard from "./movieCard";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 80,
    height: 120,
  },

  list: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
}));

export const fetchData = async (id, page) => {
  const result = await instance.get("discover/movie", {
    params: {
      language: "en-US",
      api_key: process.env.REACT_APP_TMDB_API_KEY,
      sort_by: "popularity.desc",
      page: page,
      with_genres: id,
    },
  });
  return result;
};

const Genre = (props) => {
  const { genreName, page } = useParams();
  const { state } = useLocation();
  const [movies, setMovies] = useState([]);
  const [pageCount, setPageCount] = useState();
  const classes = useStyles();
  const history = useHistory();

  const handlePagination = (event, page) => {
    history.push({
      pathname: `/genre/${genreName}/${page}`,
      state: { id: state.id },
    });
  };

  useEffect(() => {
    try {
      fetchData(state.id, page).then((res) => {
        setMovies(res.data.results);
        setPageCount(res.data.total_pages);
      });
    } catch (err) {
      console.log(err);
    }
  }, [state.id, page]);
  return (
    <Grid container justify="center">
      <Grid item xs={12} md={11} lg={10}>
        <Grid container spacing={8} justify="space-around">
          <Grid item xs={12}>
            <h2>{genreName} Movies</h2>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {movies.map((movie, i) => (
                <Grid
                  key={`${i}`}
                  item
                  xs={12}
                  md={4}
                  lg={4}
                  className={classes.cardGrid}
                >
                  <MovieCard key={movie.id} id={movie.id} data={movie} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Pagination
                count={pageCount}
                variant="outlined"
                color="primary"
                onChange={handlePagination}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Genre;
