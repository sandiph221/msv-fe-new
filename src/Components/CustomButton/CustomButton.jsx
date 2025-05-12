import { Button, withStyles } from "@mui/material";


const StyledButton = withStyles({
  root: {
    width: props => props.width ? "100%" : "auto",
    backgroundColor: (props) =>
      props.backgroundColor
        ? "#fff"
        : props.defaultBackgroundColor
          ? "#FBE281"
          : "transparent",
    fontSize: props => props.initialProfileAdd ? 10 : 15,
    color: "#323132",
    whiteSpace: "nowrap",
    border: (props) =>
      props.defaultBackgroundColor || props.border ? "1px solid #fff" : "1px solid #BDBDBD;",
    borderRadius: "4px",
    padding: "8px 21px",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#FBE281",
      border: "1px solid #fff",
    },
  },
  label: {
    color: "#323132",
  },
  disabled: {
    opacity: 0.6
  }
})(Button);

export const CustomButton = ({
  children,
  onClick,
  startIcon,
  backgroundColor,
  defaultBackgroundColor,
  width,
  initialProfileAdd,
  border,
  disabled,
  style
}) => {
  return (
    <StyledButton
      variant="outlined"
      onClick={onClick}
      startIcon={startIcon}
      backgroundColor={backgroundColor}
      defaultBackgroundColor={defaultBackgroundColor}
      width={width}
      initialProfileAdd={initialProfileAdd}
      border={border}
      disabled={disabled}
      style={style ? style : {}}
    >
      {children}
    </StyledButton>
  );
};
