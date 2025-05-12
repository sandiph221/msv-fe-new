import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { MSVFooterLogo } from "../logosandicons";

export const Footer = () => {
  return (
    <>
      {/* <AppBar position="static"  style={{backgroundColor: "black"}}>
          <Container maxWidth="md">
            <Toolbar style={{display: "flex", justifyContent: "center"}}>
              <Typography variant="body1" color="inherit">
              ©️ 2021 Kinado Pty Limited
              </Typography>
            </Toolbar>
          </Container>
        </AppBar> */}
      <AppBar
        position="static"
        style={{ backgroundColor: "#FBE281", paddingTop: 5 }}
      >
        <Container maxWidth="md">
          <Toolbar style={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="body1" color="">
              <img
                style={{ width: 270, height: 50 }}
                src={MSVFooterLogo}
                alt="footerLogo"
              />
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
