import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

export const HelpPageArticle = (props) => {
  const [show, setShow] = useState(false);
  const onClick = () => {
    setShow(true);
  };

  useEffect(() => {
    props.getShowStatus(show);
  }, [show]);

  return (
    <Container>
      <Box direction="row">
        <KeyboardBackspaceIcon />
        <p onClick={onClick}>go back</p>
      </Box>
      this is help page articel
    </Container>
  );
};
