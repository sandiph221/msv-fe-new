import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert as MuiAlert } from "@mui/material";

export default function ClearToast() {
  const dispatch = useDispatch();
  const { open, message, variant } = useSelector((state) => state.toast);

  function handleClose() {
    dispatch({
      type: "ClearToast",
    });
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      aria-describedby="client-snackbar"
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={variant}
        sx={{ width: "100%" }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
}
