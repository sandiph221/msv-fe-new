import { Fragment } from "react";
import {
  Avatar,
  Card,
  Typography,
  makeStyles,
  CardContent,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import Styles from "./Styles";
import * as constant from "../../utils/constant";
// get our fontawesome imports
// import FontAwesome from 'react-fontawesome';
// import faStyles from 'font-awesome/css/font-awesome.css';

const useStyles = makeStyles((theme) => Styles(theme));

const Cards = ({ handleDeleteConfirm, item, getSelectedData }) => {
  const { user } = useSelector((state) => state.auth);
  const [shadow, setShadow] = React.useState(0);
  const dispatch = useDispatch();

  const classes = useStyles();
  return (
    <Fragment>
      <Card
        elevation={shadow}
        onMouseOver={() => setShadow(4)}
        onMouseOut={() => setShadow(0)}
        className={classes.cardContainer}
      >
        <div className={classes.imageTextContainer}>
          <CardContent className={classes.userProfile}>
            <Avatar src={item.imageURL} rounded />
          </CardContent>

          <CardContent className={classes.userDetails}>
            {item.brand ? (
              <Typography className={classes.titleStyle}>
                {user.role === constant.SUPER_ADMIN_NAME
                  ? item.brand.brand_name
                  : `${item.first_name} ${item.last_name}`}
              </Typography>
            ) : (
              ""
            )}
            <Typography className={classes.subtitleStyle}>
              {item.email}
            </Typography>
            <Typography style={{ fontSize: 11 }}> @{item.role} </Typography>
          </CardContent>
        </div>

        <div className={classes.iconContainer}>
          {/* <FontAwesomeIcon icon={faHome} /> */}
          <CreateIcon
            className={classes.iconComponenticonComponent}
            onClick={() => getSelectedData(item)}
          />
          {/* <DeleteIcon
            className={classes.iconComponenticonComponent}
            onClick={() => handleDeleteConfirm(item)}
          /> */}
        </div>
      </Card>
    </Fragment>
  );
};

export default Cards;
