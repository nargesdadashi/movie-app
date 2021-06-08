import { TextField, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import debounce from "lodash.debounce";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import instance from "../services/tmdbAPI";
import { useHistory } from "react-router-dom";
// import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },

  inputAuto: {
    width: 400,
  },
  input: {
    backgroundColor: "white",
    width: 400,
    borderRadius: "4px",
  },
  iconButton: {
    padding: 10,
  },
}));

const Search = () => {
  const classes = useStyles();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [autoCompleteInput, saveToAutoCompleteInput] = useState("");
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const history = useHistory();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  });

  const debouncedSave = useMemo(
    () => debounce((nextValue) => saveToAutoCompleteInput(nextValue), 500),
    []
  );

  const handleChange = useCallback(
    (event) => {
      const nextValue = event.target.value;
      setSearchInputValue(nextValue);
      debouncedSave(nextValue);

      //if useCallback was instead of useMemo -> debouncedSave()(nextValue)
    },
    [debouncedSave]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await instance.get("/search/movie", {
          params: {
            language: "en-US",
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            query: autoCompleteInput,
            page: "1",
          },
        });

        setAutoCompleteResult(result.data.results.slice(0, 6));
      } catch (err) {
        console.log(err);
      }
    };

    if (autoCompleteInput) {
      fetchData();
    }
  }, [autoCompleteInput]);

  const handleSearch = (movieTitle) => {
    history.push(`/result/${movieTitle}/1`);
  };

  return (
    <Autocomplete
      freeSolo
      disableClearable
      id="free-solo-2-demo"
      className={classes.inputAuto}
      options={autoCompleteResult.map((option) => option.original_title)}
      inputValue={searchInputValue}
      onChange={(event, newValue) => {
        handleSearch(newValue);
      }}
      onInputChange={(event, newValue, reason) => {
        if (reason === "input") {
          handleChange({
            target: {
              name: "search",
              value: newValue,
            },
          });
        }
      }}
      renderInput={(params) => (
        <TextField
          className={classes.input}
          placeholder="Search Movie"
          {...params}
          variant="outlined"
          margin="normal"
          name="search"
          onKeyPress={(e) => {
            if (e.key === "Enter" && e.target.value) {
              handleSearch(searchInputValue);
            }
          }}
          InputProps={{
            ...params.InputProps,
            type: "search",

            endAdornment: (
              <InputAdornment>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default Search;
