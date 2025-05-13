/* eslint-disable @next/next/no-img-element */
import { Link, useLocation } from "react-router-dom";
import * as React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Hidden,
  IconButton,
  Typography,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";

import { MobileNav } from "./MobileNav";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  navContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
  logo: {
    height: 32,
    width: 32,
    marginRight: theme.spacing(1),
  },
  brandText: {
    textTransform: "lowercase",
  },
  navLinks: {
    display: "flex",
    gap: theme.spacing(4),
  },
  navLink: {
    textDecoration: "none",
    fontSize: 16,
    transition: "color 0.3s",
    "&:hover": {
      opacity: 0.8,
    },
  },
  activeLink: {
    color: theme.palette.primary.main,
  },
  inactiveLink: {
    color: theme.palette.text.primary,
  },
  disabledLink: {
    opacity: 0.8,
    cursor: "not-allowed",
  },
  buttonContainer: {
    display: "flex",
    gap: theme.spacing(2),
  },
  getStartedButton: {
    borderRadius: 50,
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    textTransform: "none",
    fontWeight: 500,
  },
  loginButton: {
    borderRadius: 50,
    border: `1px solid ${theme.palette.divider}`,
    textTransform: "none",
    fontWeight: 500,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
}));

export function MainNav({ items, children }) {
  const classes = useStyles();
  const location = useLocation();
  const segment = location.pathname.split("/")[1] || "";
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  return (
    <div className={classes.navContainer}>
      <Hidden mdDown>
        <Link to="/" className={classes.logoContainer}>
          <img
            src="/android-chrome-192x192.png"
            alt="My Social View"
            className={classes.logo}
          />
          <Typography variant="h6" className={classes.brandText}>
            my <strong>social</strong> view
          </Typography>
        </Link>
      </Hidden>

      <Hidden mdDown>
        {items?.length ? (
          <nav className={classes.navLinks}>
            {items?.map((item, index) => (
              <Link
                key={index}
                to={item.disabled ? "#" : item.href}
                className={`${classes.navLink} ${
                  item.href === `/${segment}`
                    ? classes.activeLink
                    : classes.inactiveLink
                } ${item.disabled ? classes.disabledLink : ""}`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}
      </Hidden>

      <div className={classes.buttonContainer}>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          className={classes.getStartedButton}
          size="large"
        >
          Get Started Now
        </Button>
        <Button
          component={Link}
          to="/login"
          variant="outlined"
          className={classes.loginButton}
          size="large"
        >
          Login
        </Button>
      </div>

      <Hidden lgUp>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <CloseIcon /> : <MenuIcon />}
          <Typography
            variant="subtitle1"
            style={{ marginLeft: 8, fontWeight: "bold" }}
          >
            Menu
          </Typography>
        </IconButton>
      </Hidden>

      {showMobileMenu && items && (
        <MobileNav setOpen={setShowMobileMenu} items={items}>
          {children}
        </MobileNav>
      )}
    </div>
  );
}
