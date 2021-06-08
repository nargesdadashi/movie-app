import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import instance from "../services/tmdbAPI";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import Search from "./search";

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

export const fetchData = async (text, page) => {
  const result = await instance.get("/search/movie", {
    params: {
      language: "en-US",
      api_key: process.env.REACT_APP_TMDB_API_KEY,
      query: text,
      page: page,
    },
  });
  return result;
};

const SearchResult = (props) => {
  const { searchedText, page } = useParams();
  const [movies, setMovies] = useState([]);
  const [pageCount, setPageCount] = useState();
  const classes = useStyles();
  const history = useHistory();

  const handlePagination = (event, page) => {
    history.push({
      pathname: `/result/${searchedText}/${page}`,
    });
  };
  const handleClickOnMovie = (id) => {
    history.push(`/movie/${id}`);
  };
  useEffect(() => {
    try {
      fetchData(searchedText, page).then((res) => {
        setMovies(res.data.results);
        setPageCount(res.data.total_pages);
      });
    } catch (err) {
      console.log(err);
    }
  }, [searchedText, page]);
  return (
    <Grid container spacing={8} justify="center">
      <Grid item xs={12} md={11}>
        <Search />
      </Grid>
      <Grid item xs={12} md={11}>
        <h2>'{searchedText}' search result:</h2>
      </Grid>
      <Grid item xs={12} md={11}>
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
              <CardActionArea
                component="a"
                onClick={() => handleClickOnMovie(movie.id)}
              >
                <Card className={classes.card}>
                  <CardContent className={classes.cardDetails}>
                    <Typography variant="subtitle2" gutterBottom>
                      {movie.original_title}
                    </Typography>
                  </CardContent>

                  <Hidden xsDown>
                    <CardMedia
                      className={classes.cardMedia}
                      image={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "https://source.unsplash.com/tV80374iytg/1400×600"
                      }
                      title="poster"
                    />
                  </Hidden>
                </Card>
              </CardActionArea>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} md={11}>
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
  );
};

export default SearchResult;
