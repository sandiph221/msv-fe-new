import Snackbar from '@material-ui/core/Snackbar';
import { CircularProgress, withStyles } from '@material-ui/core';

const StyledSnackbar = withStyles({
    root: {
        zIndex: props => props.zindex ? 999 : 99,
        "& .MuiSnackbarContent-message": {
            fontSize: 12,
            // color: "#323132"
        },
        "& .MuiPaper-root": {
            // backgroundColor: "#FFF8DE "
        }
    },
})(Snackbar)

export const SnackBarDownload = ({message, sociallistening}) => {
const action = (
    <CircularProgress size={15} disableShrink style={{color: "#fff"}}/>
  );
  

    return (
        
            <StyledSnackbar
            message={message}
            open={true}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
            }}
            action={action}
            zindex={sociallistening}
             />
        
    )
}
