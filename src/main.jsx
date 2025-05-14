import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { useEffect } from "react";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store/index.js";
import { getSubDomain } from "./utils/functions.js";
import { createTheme, ThemeProvider, CssBaseline } from "@material-ui/core";
import { getSignInUser } from "./store/actions/AuthAction.js";
import { SnackbarProvider } from "notistack";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./utils/axios.js";
import { LoadLogoAndBanner } from "./store/actions/SettingActions.js";

const AppWrapper = () => {
  const dispatch = useDispatch();
  const { logoBannerDataLoaded } = useSelector((state) => state.settings);
  const { serverError } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const subDomain = getSubDomain();
    if (subDomain) dispatch(LoadLogoAndBanner(subDomain));
    if (serverError) toast.error("Check your internet connection");
    else console.log("App connected 🚀");
  }, [dispatch, serverError]);

  useEffect(() => {
    if (user) dispatch(getSignInUser(user.id));
  }, [dispatch, user?.id]);

  const shouldLoad = !getSubDomain() || logoBannerDataLoaded;
  if (!shouldLoad) return null;

  return <App />;
};

const theme = createTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiOutlinedInputNotchedOutline: {
      notched: true,
    },
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    whiteSpace: "nowrap !important",
  },
  palette: {
    common: {
      darkGreen: "#33918a",
      lightGreen: "red",
      lightBlack: "#323132",
    },
  },
});

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AppWrapper />
          <CssBaseline />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
  document.getElementById("root")
);
