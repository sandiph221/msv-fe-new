import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import RemoveIcon from "@mui/icons-material/Remove";
import Spinner from "../Spinner";
import { numbersFormat } from "utils/functions.js";
import { Styles } from "./Styles";

const useStyles = makeStyles((theme) => Styles(theme));

export const SocialMediaCardLabels = ({
  cardTitle,
  cardFigures,
  cardGrowthRate,
  cardIcon,
  colorCode,
  filterType,
  loading,
  socialListening,
}) => {
  const trimCardGrowthrate = parseInt(cardGrowthRate);
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = useStyles({
    xs,
    socialListening,
    loading,
    colorCode,
    trimCardGrowthrate,
  });

  return (
    <div>
      <Card variant="outlined" className={classes.labelWrapper}>
        {!socialListening && loading ? (
          <Spinner />
        ) : (
          <>
            <CardContent className={classes.cardLabelContent}>
              <div className={classes.labelContentTitleWrapper}>
                <Typography className="title">{cardTitle}</Typography>{" "}
                <Typography className="filter-type">
                  {filterType ? `(${filterType})` : ""}
                </Typography>
              </div>
              <div className={classes.cardFiguresWrapper}>
                <Typography className="figures">
                  {socialListening && loading ? (
                    <Spinner />
                  ) : (
                    cardFigures && numbersFormat(cardFigures)
                  )}
                </Typography>
              </div>

              {!socialListening && (
                <div className={classes.cardGrowthWrapper}>
                  <Typography className="growth-figures">
                    {" "}
                    {!trimCardGrowthrate || trimCardGrowthrate == 0 ? (
                      <RemoveIcon style={{ marginTop: "-2px" }} />
                    ) : trimCardGrowthrate < 0 ? (
                      <CallReceivedIcon />
                    ) : (
                      <CallMadeIcon />
                    )}{" "}
                    {trimCardGrowthrate ? trimCardGrowthrate : 0}%
                  </Typography>
                  <Typography className="growth">Absolute Growth</Typography>
                </div>
              )}
            </CardContent>
            <CardActions className={classes.cardCardAction}>
              <Avatar className={classes.cardlabelIcon}>{cardIcon}</Avatar>
            </CardActions>
          </>
        )}
      </Card>
    </div>
  );
};
