
import { makeStyles, withStyles } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import DoneIcon from "@mui/icons-material/Done";
import { useDispatch } from "react-redux";
import { deleteSearchQuery } from "../../store/actions/SocialMediaProfileAction";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));
/* styled component starts */
const StyledChip = withStyles({
  root: {
    backgroundColor: "#fff8de",
    border: "1px solid #E0E0E0",
  },
  label: {
    fontSize: 15,
    color: "#323132",
    fontWeight: (props) => (props.bold ? 600 : "normal"),
  },
})(Chip);

const SocialListeningChipData = ({ chipData, loader, clearDisplayData }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleDelete = (chipToDelete) => () => {
    dispatch(deleteSearchQuery(chipToDelete));
    clearDisplayData()
  };

  return (
    <div className={classes.root}>
      {[...chipData].map((data, index) => {
        return (
          <StyledChip
            key={index}
            bold={true}
            label={data}
            onDelete={data === "React" ? undefined : handleDelete(data)}
            disabled={loader}
          />
        );
      })}
    </div>
  );
};

export default SocialListeningChipData;
