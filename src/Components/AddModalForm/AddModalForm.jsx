import { useEffect } from "react";

import {
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  TextField,
  withStyles,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ReplyIcon from "@mui/icons-material/Reply";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Styles from "../../Pages/Help/Styles";
import {
  creatContactSupport,
  creatRespondSupport,
  getContactSupportList,
} from "../../store/actions/HelpPageAction";
import * as constant from "../../utils/constant";
import { CustomButton } from "../CustomButton/CustomButton";
import Spinner from "../Spinner";

//custom style
const useStyles = makeStyles((theme) => ({
  inputLabel: {
    color: "#646970",
    fontWeight: 400,
    letterSpacing: 0.5,
    fontSize: 14,
  },
  DialogFooter: {
    justifyContent: "flex-start",
  },
}));
const useStyles1 = makeStyles((theme) => Styles(theme));
/* styled component starts */
const StyledTextField = withStyles({
  root: {
    height: 35,
    "& .MuiOutlinedInput-root": {
      "& input": {
        zIndex: 9999,
        padding: "10px 20px",
      },
      "& fieldset": {
        borderRadius: 10,
        backgroundColor: (props) =>
          props.backgroundColor ? "#fff" : "transparent",
      },
    },
  },
})(TextField);

const StyledDialog = withStyles({
  paper: {
    padding: (props) => (props.xs ? 20 : "37px 25px"),
    height: (props) => (props.customersuportform ? "75vh" : "100vh"),
    margin: 0,
    borderRadius: 19,
  },
})(Dialog);

const StyledDialogTitle = withStyles({
  root: {
    padding: 0,
    marginBottom: 15,

    color: "rgb(251, 226, 129)",
    "& .MuiTypography-root": {
      fontSize: 32,
      fontWeight: 600,
    },
  },
})(DialogTitle);

export default function AddModalForm({ customerSupportForm, data, dateRange }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const classes1 = useStyles1();
  const [open, setOpen] = React.useState(false);
  const [formLoader, setFormLoader] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [supportForm, setSupportForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    message: "",
  });

  const { user } = useSelector((state) => state.auth);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormLoader(false);
    setErrors({});
    setSupportForm((prevProps) => ({
      ...prevProps,
      message: "",
    }));
  };

  const handleChange = (event) => {
    setSupportForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const addSection = async (event) => {
    const specialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    event.preventDefault();

    let formErrors = {};

    // Check for empty value

    if (!customerSupportForm && !supportForm.firstName) {
      formErrors.firstName = "First Name is Required";
    }
    if (!customerSupportForm && !supportForm.lastName) {
      formErrors.lastName = "Last Name is Required";
    }
    if (customerSupportForm && !supportForm.email) {
      formErrors.email = "Email is Required";
    }
    if (typeof supportForm.email !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(constant.EMAIL_PATTERN);
      if (!pattern.test(supportForm.email)) {
        formErrors.email = "Please enter valid email-ID.";
      }
    }
    if (!customerSupportForm && !supportForm.mobileNumber) {
      formErrors.mobileNumber = "Mobile number is Required";
    }
    /* checking if the fields contains only number */
    if (!customerSupportForm && isNaN(supportForm.mobileNumber)) {
      formErrors.phoneNumber = "Mobile Number must be a valid ";
    }
    if (specialCharacters.test(supportForm.mobileNumber)) {
      formErrors.mobileNumber =
        "Mobile Number cannot contain any special characters.";
    }
    if (customerSupportForm && !supportForm.message) {
      formErrors.message = "Message is Required";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0 && !customerSupportForm) {
      setFormLoader(true);
      try {
        const response = await dispatch(creatContactSupport(supportForm));
        if (response.data.status_code === 200) {
          setFormLoader(false);
          setErrors({});
          setSupportForm((prevProps) => ({
            ...prevProps,
            message: "",
          }));
          setOpen(false);
        }
      } catch (error) {
        if (error) {
          toast.error(error.response.data.message);
          setFormLoader(false);
          setOpen(false);
        }
      }
    } else if (Object.keys(formErrors).length === 0 && customerSupportForm) {
      setFormLoader(true);
      try {
        const response = await dispatch(
          creatRespondSupport(supportForm, data.id)
        );
        if (response.data.status_code === 200) {
          setFormLoader(false);
          setErrors({});
          setSupportForm({
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: "",
            message: "",
          });
          setOpen(false);
          dispatch(getContactSupportList());
        }
      } catch (error) {
        if (error) {
          toast.error(error.response.data.message);
          setFormLoader(false);
          setOpen(false);
        }
      }
    }
  };

  useEffect(() => {
    if (user && user.role === "customer-admin") {
      setSupportForm({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        mobileNumber: user.contact_number,
      });
    }
  }, [user]);

  useEffect(() => {
    if (data && customerSupportForm) {
      setSupportForm({
        email: data.email,
      });
    }
  }, [data, customerSupportForm]);

  return (
    <div>
      {customerSupportForm ? (
        <IconButton
          disableRipple
          disableFocusRipple
          disabled={data.answered}
          onClick={handleClickOpen}
          style={{ color: data.answered ? "#bdbdbd" : "#343434" }}
        >
          <ReplyIcon />
        </IconButton>
      ) : (
        <div className={classes1.helpList} onClick={handleClickOpen}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              className={classes1.helpIconList}
              style={{ backgroundColor: "#f8c1441a" }}
            >
              <MailOutlineIcon style={{ color: "#f8c144" }} />
            </div>

            <p> Contact Support </p>
          </div>
        </div>
      )}

      <StyledDialog
        customersuportform={customerSupportForm}
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <StyledDialogTitle id="form-dialog-title">
            {" "}
            {customerSupportForm ? "Respond" : "Support"}{" "}
          </StyledDialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{
              border: "1px solid #ccc",
              borderRadius: 9,
              minHeight: 44,
              maxHeight: 44,
            }}
          >
            <CloseIcon style={{ color: "#323132" }} />
          </IconButton>
        </div>
        <DialogContent
          style={{ paddingLeft: 0, paddingRight: 0, overflowX: "hidden" }}
        >
          <Container disableGutters>
            <Grid container spacing={2}>
              {!customerSupportForm && (
                <Grid item xs={12} md={6}>
                  <InputLabel
                    className={classes.inputLabel}
                    htmlFor="my-input"
                    style={{ marginBottom: 14 }}
                  >
                    {" "}
                    First Name *{" "}
                  </InputLabel>
                  <StyledTextField
                    variant="outlined"
                    autoFocus
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    type="text"
                    value={supportForm.firstName}
                    onChange={handleChange}
                    fullWidth
                    error={errors.firstName ? true : false}
                    helperText={errors && errors.firstName}
                  />
                </Grid>
              )}
              {!customerSupportForm && (
                <Grid item xs={12} md={6}>
                  <InputLabel
                    className={classes.inputLabel}
                    htmlFor="my-input"
                    style={{ marginBottom: 14 }}
                  >
                    {" "}
                    Last Name *{" "}
                  </InputLabel>
                  <StyledTextField
                    variant="outlined"
                    autoFocus
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    type="text"
                    value={supportForm.lastName}
                    onChange={handleChange}
                    fullWidth
                    error={errors.lastName ? true : false}
                    helperText={errors && errors.lastName}
                  />
                </Grid>
              )}

              <Grid
                item
                xs={12}
                md={customerSupportForm ? 12 : 6}
                style={{ marginTop: 25 }}
              >
                <InputLabel
                  className={classes.inputLabel}
                  htmlFor="my-input"
                  style={{ marginBottom: 14 }}
                >
                  Email *{" "}
                </InputLabel>
                <StyledTextField
                  variant="outlined"
                  autoFocus
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="text"
                  value={supportForm.email}
                  onChange={handleChange}
                  fullWidth
                  error={errors.email ? true : false}
                  helperText={errors && errors.email}
                />
              </Grid>
              {!customerSupportForm && (
                <Grid item xs={12} md={6} style={{ marginTop: 25 }}>
                  <InputLabel
                    className={classes.inputLabel}
                    htmlFor="my-input"
                    style={{ marginBottom: 14 }}
                  >
                    {" "}
                    Mobile Number *{" "}
                  </InputLabel>
                  <StyledTextField
                    variant="outlined"
                    autoFocus
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    type="text"
                    value={supportForm.mobileNumber}
                    onChange={handleChange}
                    fullWidth
                    error={errors.mobileNumber ? true : false}
                    helperText={errors && errors.mobileNumber}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={12} style={{ marginTop: 25 }}>
                <InputLabel
                  className={classes.inputLabel}
                  htmlFor="my-input"
                  style={{ marginBottom: 14 }}
                >
                  {" "}
                  Message *{" "}
                </InputLabel>
                <TextField
                  style={{ borderRadius: 10, minWidth: "100%" }}
                  id="formSupportMessage"
                  name="message"
                  placeholder="Type your message here"
                  multiline
                  rows={7}
                  variant="outlined"
                  value={supportForm.message}
                  onChange={handleChange}
                  error={errors.message ? true : false}
                  helperText={errors && errors.message}
                />
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions className={classes.DialogFooter}>
          {/* <Button onClick={handleClose} color="primary">
            Cancel
          </Button> */}
          <CustomButton
            defaultBackgroundColor
            onClick={addSection}
            disabled={formLoader}
          >
            {formLoader && <Spinner size={20} />}Send
          </CustomButton>
        </DialogActions>
      </StyledDialog>
    </div>
  );
}
