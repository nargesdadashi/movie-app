import React, { useEffect, useState } from "react";
import GenreSection from "./genreSection";
import Typography from "@material-ui/core/Typography";
import instance from "../services/tmdbAPI";
import Grid from "@material-ui/core/Grid";
import Search from "./search";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  searchBox: {
    height: "60vh",
    backgroundImage: "url(https://source.unsplash.com/2uwFEAGUm6E/1400×600)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
}));

export const fetchData = async () => {
  const result = await instance.get("genre/movie/list", {
    params: {
      language: "en-US",
      api_key: process.env.REACT_APP_TMDB_API_KEY,
    },
  });
  return result;
};

const Explore = () => {
  const classes = useStyles();
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    try {
      fetchData().then((res) => {
        setGenres(res.data.genres);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <Grid container justify="center" spacing={5}>
      <Grid item xs={12} md={12}>
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.searchBox}
        >
          <Search />
        </Grid>
      </Grid>
      <Grid item xs={12} md={11}>
        {genres.map((genre, i) => (
          <div key={`${i}`}>
            <Typography variant="h6" gutterBottom>
              {genre.name}
            </Typography>
            <GenreSection id={genre.id} name={genre.name} />
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default Explore;
