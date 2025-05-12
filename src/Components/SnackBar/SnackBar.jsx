import { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { CircularProgress, withStyles } from "@mui/material";

const StyledSnackbar = withStyles({
  root: {
    zIndex: 99,
    "& .MuiSnackbarContent-message": {
      fontSize: 12,
      // color: "#323132"
    },
    "& .MuiPaper-root": {
      // backgroundColor: "#FFF8DE "
    },
  },
  anchorOriginTopRight: {
    top: 182,
    right: 44,
    position: "absolute",
  },
})(Snackbar);

export const SnackBar = ({ data, message }) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState([]);

  useEffect(() => {
    if (data) {
      setState([]);
      const downloadingData = data.filter(
        (data) => data.is_data_downloading === true
      );
      setState(downloadingData);
      if (downloadingData.length > 0) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [data]);

  const action = (
    <CircularProgress size={15} disableShrink style={{ color: "#fff" }} />
  );

  return (
    <StyledSnackbar
      id="snack-bar"
      message={
        message ? message : `${state.length} profile's data are downloading`
      }
      open={open}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      action={action}
    />
  );
};
