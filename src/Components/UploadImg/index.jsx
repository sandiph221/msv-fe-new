// imports the React Javascript Library
import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Fab,
  Icon,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PageviewIcon from "@mui/icons-material/Pageview";
import SearchIcon from "@mui/icons-material/Search";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CollectionsIcon from "@mui/icons-material/Collections";

// Styled components to replace withStyles
const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  border: "1px solid rgba(0, 0, 0, 0.23)",
  borderRadius: 10,
}));

const UploadImgCard = styled(Card)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  width: "100%",
  height: 250,
  boxShadow: "none",
  backgroundColor: "transparent",
  borderColor: "rgba(0, 0, 0, 0.23)",
}));

const StyledInput = styled("input")({
  opacity: 0,
  position: "absolute",
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  width: "100%",
  height: "100%",
});

const CardHeaderStyled = styled(CardHeader)({
  textalign: "center",
  align: "center",
  backgroundColor: "white",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
  fontFamily: "Montserrat",
  align: "center",
}));

const UploadButton = styled(Fab)(({ theme }) => ({
  color: "#F8C144",
  margin: 10,
  background: "rgba(248, 193, 68, 0.2) !important",
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  color: "gray",
  margin: 10,
}));

const CancelIcon = styled(CloseIcon)(({ theme }) => ({
  position: "absolute",
  top: 5,
  right: 5,
  background: "#000",
  color: "#fff",
  borderRadius: "50%",
  boxShadow:
    "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
}));

const UploadBtnWrapper = styled("label")({
  display: "flex",
  alignItems: "center",
});

const UploadedImg = styled("img")({
  objectFit: "contain",
  maxHeight: "250px",
});

const ImageUploadCard = (props) => {
  const [state, setState] = useState({
    mainState: "initial",
    selectedFile: null,
    imgPreview: "",
    id: props.id,
    defaultImg: null,
  });

  const theme = useTheme();

  /* handling default image on update */
  useEffect(() => {
    setState({
      ...state,
      imgPreview: props.defaultImg,
      mainState: props.defaultImg ? "uploaded" : "initial",
      defaultImg: props.defaultImg,
    });
  }, [props.defaultImg]);

  /* handling image on creating new customer */
  useEffect(() => {
    if (props.refresh === true) {
      props.setRefreshImgUploadComponent(false);

      setState({
        ...state,
        imgPreview: "",
        mainState: "initial",
        defaultImg: "",
      });
    }
  }, [props.refresh]);

  const handleUploadClick = (event) => {
    var file = event.target.files[0];

    const reader = new FileReader();

    if (file && file.type.match("image.*")) {
      reader.readAsDataURL(file);
    } else return;

    reader.onloadend = function (e) {
      setState({
        ...state,
        mainState: "uploaded",
        selectedFile: event.target.files[0],
        imageUploaded: 1,
        imgPreview: [reader.result],
      });
    };

    /* passing file to parent component by calling parent method */
    props.getSelectedData(event.target.files[0]);
  };

  const renderInitialState = () => {
    return (
      <React.Fragment>
        <CardContent>
          <Grid container justifyContent="center" alignItems="center">
            <StyledInput
              id={props.id}
              accept="image/*"
              name={props.name}
              multiple
              type="file"
              onChange={handleUploadClick}
            />

            <UploadBtnWrapper htmlFor={props.id}>
              <UploadButton component="span">
                <AddPhotoAlternateIcon />
              </UploadButton>
              <Typography variant="h6">{props.title}</Typography>
            </UploadBtnWrapper>
          </Grid>
        </CardContent>
      </React.Fragment>
    );
  };

  const renderUploadedState = () => {
    return (
      <React.Fragment>
        <CardActionArea style={{ display: "flex", height: "100%" }}>
          <StyledInput
            id={props.id}
            accept="image/*"
            name={props.name}
            multiple
            type="file"
            onChange={handleUploadClick}
          />
          <UploadedImg src={state.imgPreview} alt="" />
          {/* <CancelIcon
            onClick={imageResetHandler}
            fontSize="medium"
          /> */}
        </CardActionArea>
      </React.Fragment>
    );
  };

  const imageResetHandler = (event) => {
    setState({
      ...state,
      mainState: "initial",
      selectedFile: null,
      imgPreview: "",
      // defaultImg: "",
      imageUploaded: 0,
    });

    /* passing file to parent component by calling parent method */
    props.getSelectedData(null);
  };

  return (
    <React.Fragment>
      <Root>
        <UploadImgCard>
          {(state.mainState === "initial" && renderInitialState()) ||
            (state.mainState === "uploaded" && renderUploadedState())}
        </UploadImgCard>
      </Root>
    </React.Fragment>
  );
};

export default ImageUploadCard;
