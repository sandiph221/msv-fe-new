import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { ArrowRightAlt } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(2),
    maxWidth: "36rem",
    margin: "0 auto",
    marginBottom: theme.spacing(6),
  },
  title: {
    fontSize: "2rem",
    fontWeight: 600,
    lineHeight: 1.3,
    textAlign: "center",
    color: theme.palette.primary.main,
    [theme.breakpoints.up("md")]: {
      fontSize: "2.5rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "3rem",
    },
  },
  description: {
    maxWidth: "32rem",
    textAlign: "center",
    fontSize: "0.875rem",
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
  },
  tableContainer: {
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "rgba(63, 81, 181, 0.1)",
  },
  planTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  planPrice: {
    fontSize: "2rem",
    fontWeight: 500,
    [theme.breakpoints.up("md")]: {
      fontSize: "2.5rem",
    },
  },
  planPriceUnit: {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
  cellCenter: {
    textAlign: "center",
  },
  cellStart: {
    textAlign: "left",
  },
  primaryButton: {
    marginTop: theme.spacing(2),
    borderRadius: 50,
    padding: theme.spacing(1, 3),
    width: "100%",
    maxWidth: "20rem",
    textTransform: "none",
  },
  outlineButton: {
    marginTop: theme.spacing(2),
    borderRadius: 50,
    padding: theme.spacing(1, 3),
    width: "100%",
    maxWidth: "20rem",
    textTransform: "none",
    backgroundColor: "rgba(63, 81, 181, 0.4)",
    borderColor: "rgba(63, 81, 181, 0.3)",
    "&:hover": {
      backgroundColor: "rgba(63, 81, 181, 0.5)",
    },
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
  footer: {
    backgroundColor: "transparent",
  },
}));

export const Plans = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <div>
          <Typography variant="h3" className={classes.title}>
            Friendly Pricing Plans
          </Typography>
          <Typography variant="body1" className={classes.description}>
            Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit
            phasellus mollis sit aliquam sit nullam.
          </Typography>
        </div>
      </div>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.cellStart}></TableCell>
              <TableCell className={classes.cellCenter}>
                <div>
                  <Typography className={classes.planTitle}>
                    Lite Plan
                  </Typography>
                  <Typography className={classes.planPrice}>
                    $19
                    <span className={classes.planPriceUnit}>/month</span>
                  </Typography>
                </div>
              </TableCell>
              <TableCell className={classes.cellCenter}>
                <Typography className={classes.planTitle}>Lite Plan</Typography>
                <Typography className={classes.planPrice}>
                  $19
                  <span className={classes.planPriceUnit}>/month</span>
                </Typography>
              </TableCell>
              <TableCell className={classes.cellCenter}>
                <Typography className={classes.planTitle}>Lite Plan</Typography>
                <Typography className={classes.planPrice}>
                  $19
                  <span className={classes.planPriceUnit}>/month</span>
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableHead className={classes.sectionHeader}>
            <TableRow>
              <TableCell className={classes.cellStart} style={{ width: "25%" }}>
                Audience
              </TableCell>
              <TableCell
                className={classes.cellCenter}
                style={{ width: "25%" }}
              >
                Basic plan
              </TableCell>
              <TableCell
                className={classes.cellCenter}
                style={{ width: "25%" }}
              >
                Pro plan
              </TableCell>
              <TableCell
                className={classes.cellCenter}
                style={{ width: "25%" }}
              >
                Premium plan
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[...Array(6)].map((_, index) => (
              <TableRow key={`audience-${index}`}>
                <TableCell className={classes.cellStart}>
                  Manage subscribers
                </TableCell>
                <TableCell className={classes.cellCenter}>Lorem</TableCell>
                <TableCell className={classes.cellCenter}>Ipsum</TableCell>
                <TableCell className={classes.cellCenter}>Dolor</TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableHead className={classes.sectionHeader}>
            <TableRow>
              <TableCell className={classes.cellStart}>
                Automation & emails
              </TableCell>
              <TableCell className={classes.cellCenter}>Status</TableCell>
              <TableCell className={classes.cellCenter}>Method</TableCell>
              <TableCell className={classes.cellCenter}>Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[...Array(6)].map((_, index) => (
              <TableRow key={`automation-${index}`}>
                <TableCell className={classes.cellStart}>
                  Manage subscribers
                </TableCell>
                <TableCell className={classes.cellCenter}>Lorem</TableCell>
                <TableCell className={classes.cellCenter}>Ipsum</TableCell>
                <TableCell className={classes.cellCenter}>Dolor</TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableHead className={classes.footer}>
            <TableRow>
              <TableCell className={classes.cellStart}></TableCell>
              <TableCell className={classes.cellCenter}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.primaryButton}
                >
                  Start a Free Trial
                  <ArrowRightAlt className={classes.buttonIcon} />
                </Button>
              </TableCell>
              <TableCell className={classes.cellCenter}>
                <Button variant="outlined" className={classes.outlineButton}>
                  Start a Free Trial
                  <ArrowRightAlt className={classes.buttonIcon} />
                </Button>
              </TableCell>
              <TableCell className={classes.cellCenter}>
                <Button variant="outlined" className={classes.outlineButton}>
                  Start a Free Trial
                  <ArrowRightAlt className={classes.buttonIcon} />
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </div>
  );
};
