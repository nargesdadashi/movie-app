import { useAuth } from "../services/authProvider";
import React, { useState } from "react";
import {
  Button,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Typography,
  Grid,
  Paper,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(1.5),
    padding: theme.spacing(4),
  },
}));

const Profile = () => {
  const { currentUser, updatePassword } = useAuth();

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handleChangePassword = async () => {
    try {
      setError("");
      setLoading(true);
      await updatePassword(password);
      setMessage("yor password successfully changed!");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  return (
    <Grid container>
      <Grid item xs={11} md={11} lg={10}>
        <Paper className={classes.paper}>
          <Typography variant="subtitle2" gutterBottom>
            email:
          </Typography>
          <Typography variant="body2" gutterBottom>
            {currentUser.email}
          </Typography>
          <div>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
            >
              Cahnge Password
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter new password.
                </DialogContentText>
                {error && (
                  <Alert variant="filled" severity="error">
                    {error}
                  </Alert>
                )}
                {message && (
                  <Alert variant="filled" severity="success">
                    {message}
                  </Alert>
                )}
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordInput}
                  label="New Password"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={loading}
                  color="primary"
                >
                  Change
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
