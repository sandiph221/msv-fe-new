import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Avatar,
  CardActions,
  makeStyles,
  Button, 
  Chip,
  withStyles,
} from "@mui/material";

import AddModalForm from "../AddModalForm/AddModalForm";
import CheckIcon from '@mui/icons-material/Check';


/* styled component starts */
const StyledChip = withStyles({
  root: {
   backgroundColor: (props) => props.ans ? "transparent" : "#fff8de",
   border: "1px solid #E0E0E0",
   alignSelf: "center"
  },
  label: {
      fontSize: 14,
      color: (props) => props.ans ? "#4caf50" : "#323132",
      fontWeight: (props) => props.bold ? 600 : "normal"
  }
})(Chip);

const useStyles = makeStyles({
  root: {
    display: "flex",
    boxShadow: "none",
    border: '1px solid #bdbdbd',
    borderRadius: 14,
    "& .MuiCardActionArea-root": {
      display: "flex",
      justifyContent: "flex-start",
      padding: "16px 0px",
      transition: "0.5s ease-in-out",
      "&:hover": {
        backgroundColor: "#fff",
        cursor: "auto"
        // padding: "16px 16px 16px 20px"
      },
      "& .MuiCardContent-root": {
          height: "100%",
          flexGrow: 1

      },
      
    },
    "& .MuiTypography-root": {
        color: "#323132",
        fontSize: 14,
    }
  },
  cardMedia: {
    padding: "10px 0px 10px 10px",
    display: "flex",
    flexDirection: "column",
    width: 100,
    "& .MuiAvatar-root ": {
        margin: "0 auto",
        height: 75,
        width: 75
    },
    "& .MuiTypography-root": {
        whiteSpace: "break-spaces",
        textAlign: "center",
      
        fontWeight: 600
    }

  },
  cardHeader: {
    display: "flex",
    marginBottom: 30,
    alignItems: "center",
    "& .MuiTypography-root": {
      marginRight: 30,
      "& span": {
        marginLeft: 10
      }
  },
 
  },
  cardAction: {
    padding: 40,
    "& .MuiSvgIcon-root":{
      cursor: "pointer"
    }
    
  }
});

export const CustomerSupportCard = ({data}) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <div className={classes.cardMedia}>
          <Avatar />
          <Typography > {data.first_name} {data.last_name} </Typography>
        </div>
        <CardContent>
          <div className={classes.cardHeader}>
            <Typography> Posted on: <span> {data.created_at} </span></Typography>
            <StyledChip bold ans={data.answered} label=  { data.answered ? "Answered" : "Unanswered"}  />
            {data.answered && <CheckIcon style={{marginLeft: 20, color: "#4caf50"}} />}
          </div>
          <div className={classes.cardDescription}>
            <Typography>
              {data.message}
            </Typography>
          </div>
          
        </CardContent>
        <div className={classes.cardAction}>
        <AddModalForm customerSupportForm="true" data={data} />
      </div>
      </CardActionArea>
      
    </Card>
  );
};
