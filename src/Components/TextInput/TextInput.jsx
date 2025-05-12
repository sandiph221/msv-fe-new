
import {
  TextField,
  makeStyles,
  withStyles,
  InputAdornment,
} from "@mui/material";
import { OutlinedInput } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const StyledTextField = withStyles({
  root: {
    height: 44,
    borderColor: "#BDBDBD",
    backgroundColor: props => props.backgroundColor ? "#fff" : "transparent",
    fontSize: 13,
    borderRadius: (props) => (props.radius == true ? "4px 4px 0px 0px" : "4px 4px 4px 4px"),
    color: "#323132",
    "& .MuiInput-underline": {
      "&:before": {
        borderBottom: 0,
      },
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#BDBDBD",
        borderWidth: 1,
      },
    },
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#BDBDBD",
      },
    },
  },
  input: {
    padding: "12px 10px",
    "&::placeholder": {
      color: "#BDBDBD",
      fontSize: 13,
      fontFamily: "Poppins, sans-serif ",
    },
  },
  notchedOutline: {
    border: "1px solid #BDBDBD",
  },
})(OutlinedInput);

const TextInput = ({
  title,
  type,
  error,
  value,  
  name,
  helperText,
  onChange,
  label,
  placeholder,
  radius,
  closeBtn,
  onClick,
  backgroundColor,
  onKeyPress,
  suggestion,
  disable
}) => {
  return (
    <StyledTextField
      radius={radius}
      backgroundColor={backgroundColor}
      id="searchProfile"
      type="text"
      onKeyPress={onKeyPress}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      fullWidth
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon style={{ color: "#323132", height: 24, width: 24 }} />
        </InputAdornment>
      }
      endAdornment={
        closeBtn ? <InputAdornment position="start">
          <CloseIcon onClick={onClick} style={{ color: "#323132", height: 18, width: 18, cursor: "pointer" }} />
        </InputAdornment> : ""
      }
      disabled={disable}
    />
  );
};

export default TextInput;
