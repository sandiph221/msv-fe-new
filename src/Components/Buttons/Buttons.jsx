
import { Button } from "@mui/material";
import {makeStyles} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  btnPrimary: {
    background: "#FBE281",
    fontSize: 15,
    color: "#323132",
    fontWeight: 600,
    borderRadius: 4,
    borderColor: "#FBE281",
    border: "1px solid ",
    margin: "auto 0",
    '&:hover': {
      backgroundColor: "#f4d45f",
      borderColor: "#f4d45f",
    },
  },

}));

const Buttons = ({ className, children, ...props }) => {
  const classes = useStyles();
  return (
    <Button className={`${classes.btnPrimary} ${className}`} variant="contained" {...props}>
      {children}
    </Button>
  );
};

export default Buttons;
