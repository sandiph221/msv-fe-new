
import { makeStyles, withStyles } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import FaceIcon from '@mui/icons-material/Face';
import DoneIcon from '@mui/icons-material/Done';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
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
        fontWeight: (props) => props.bold ? 600 : "normal"
    }
  })(Chip);

const ChipComp = ({chipData, setChipData, setApiResponse}) => {
  const classes = useStyles();

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.label !== chipToDelete.label));
   if( setApiResponse) {
    setApiResponse({})
   }
  };

  return (
    <div className={classes.root}>
      {chipData.map((data)=> {
        return (
          <StyledChip key={data.key} bold={true} label={data.label} onDelete={data.label === 'React' ? undefined : handleDelete(data)} />

        )
      })}
    
    {/* <StyledChip bold label="Chicago" onDelete={handleDelete}/>
      <StyledChip
        avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />}
        label="The Hunter and Barrel"
        onDelete={handleDelete}
      /> */}
     
    </div>
  );
}

export default ChipComp