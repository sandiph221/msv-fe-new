import {
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  Typography,
  makeStyles,
} from "@mui/material";
import OfflineBoltOutlined from "@mui/icons-material/OfflineBoltOutlined";
import { useEffect, useState } from "react";
import { COUNTRIES } from "../../utils/constant";

import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sentenceCase } from "utils/string";
import Buttons from "../../Components/Buttons/Buttons";
import Spinner from "../../Components/Spinner";
import { formatServerImages } from "utils/functions.js";
import styles from "../Login/Styles/index.js";

const useStyles = makeStyles((theme) => styles(theme));

const CreditCardForm = () => {
  const registeredEmail = localStorage.getItem("email");
  const { logoURL } = useSelector((state) => state.settings);

  // State for form fields
  const [formValues, setFormValues] = useState({
    subdomain: "",
    planId: "",
  });

  // State for form validation errors
  const [errors, setErrors] = useState({});
  const [userFormSubmitting, setUserFormSubmitting] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    getSubscriptionPlans().catch(console.log);
  }, []);

  const getSubscriptionPlans = async () => {
    try {
      const subscriptionPlans = await axios.get("/subscription-plans");
      if (subscriptionPlans) {
        setSubscriptionPlans(subscriptionPlans.data.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!registeredEmail) {
      window.location.href = "/login";
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        email: registeredEmail,
      }));
    }
  }, [registeredEmail]);

  // Handling input change
  const handleChange = (name, value) => {
    if (name === "country") {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: value,
        zipCode: COUNTRIES.find(
          (country) => country.name === value
        ).mobileCode.split("+")[1],
      }));
    } else if (name === "planId") {
      const selectedPlan = subscriptionPlans.find((plan) => plan.id === value);
      setFormValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setPlan(selectedPlan);
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Validation logic
  const validateForm = () => {
    const errors = {};

    if (!formValues.priceId) {
      errors.priceId = "Subscription Plan is required";
    }
    // Set errors
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (validateForm()) {
        await axios
          .post(`/subscription/${formValues.priceId}`, formValues)
          .then((response) => {
            if (response.data.status && response.data.data) {
              toast.success("Registered Successfully");
              window.location.href = "/login";
            } else {
              throw new Error(response.data);
            }
          });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUserFormSubmitting(false);
    }
  };
  const classes = useStyles();

  return (
    <div>
      <Grid container>
        <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
          <div className={classes.root}>
            <div className={classes.loginTitle}>
              <img src={formatServerImages(logoURL)} height="55" alt="server" />
            </div>
            <div className="loginWrapper">
              <Typography className={classes.loginWelcome}>
                Payment Information
              </Typography>
              <Typography className={classes.loginDesc}>
                {" "}
                Please provide the card details to proceed
              </Typography>
            </div>
            <Grid>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={4} justifyContent="space-between">
                  {subscriptionPlans?.map((plan) => (
                    <Grid
                      item
                      key={`plan-${plan.id}`}
                      spacing={4}
                      xs={6}
                      md={6}
                    >
                      <Card
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: "sm",
                          backgroundColor: "#FFF2DA",
                          border: "1px solid #EDB548",
                        }}
                      >
                        <CardContent
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                          onClick={(e) => handleChange("planId", plan.id)}
                        >
                          <Radio
                            name="planId"
                            checked={plan.id === formValues.planId}
                            value={plan.id}
                            variant="soft"
                            sx={{ mb: 1, mr: 1 }}
                          />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                level="body-lg"
                                sx={{ mt: 1 }}
                                style={{
                                  fontSize: 18,
                                  fontWeight: "600",
                                }}
                              >
                                {plan.name}
                              </Typography>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}

                  {plan && (
                    <Grid item spacing={4} xs={12} md={12}>
                      <FormControl style={{ width: "100%" }} variant="outlined">
                        <FormLabel id="plan-select" style={{ marginBottom: 8 }}>
                          Membership Plan
                        </FormLabel>
                        <RadioGroup
                          name="priceId"
                          orientation="vertical"
                          style={{ gap: 8 }}
                        >
                          <Grid
                            container
                            spacing={2}
                            xs={12}
                            md={12}
                            justifyContent="space-between"
                            flexDirection="row"
                          >
                            {plan?.PlanTypePrices?.map((subPlan) => (
                              <Grid
                                item
                                key={`subplan-${subPlan.id}`}
                                spacing={4}
                                xs={6}
                                md={4}
                              >
                                <Card
                                  style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    boxShadow: "sm",
                                    backgroundColor: "#FFF2DA",
                                    border: "1px solid #EDB548",
                                  }}
                                >
                                  <CardContent
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                    onClick={(e) =>
                                      handleChange("priceId", subPlan.id)
                                    }
                                  >
                                    <Radio
                                      name="priceId"
                                      checked={
                                        subPlan.id === formValues.priceId
                                      }
                                      value={subPlan.id}
                                      variant="soft"
                                      sx={{ mb: 1, mr: 1 }}
                                    />
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <Typography
                                          level="body-lg"
                                          sx={{ mt: 1 }}
                                          style={{
                                            fontSize: 18,
                                            fontWeight: "600",
                                          }}
                                        >
                                          Pay {sentenceCase(subPlan.duration)}
                                        </Typography>
                                        <Typography
                                          level="body-lg"
                                          style={{
                                            ml: "auto",
                                            fontSize: 14,
                                            color: "#8A9399",
                                            fontWeight: "400",
                                          }}
                                          className="text-gray-600"
                                        >
                                          $
                                          {parseFloat(
                                            subPlan.discountPercentage
                                          ) > 0
                                            ? (
                                                parseFloat(subPlan.price) -
                                                (parseFloat(subPlan.price) *
                                                  parseFloat(
                                                    subPlan.discountPercentage
                                                  )) /
                                                  100
                                              ).toFixed(2)
                                            : parseFloat(subPlan.price).toFixed(
                                                2
                                              )}{" "}
                                          / Month
                                        </Typography>
                                      </div>

                                      {parseFloat(subPlan.discountPercentage) >
                                        0 && (
                                        <Typography
                                          level="body-lg"
                                          style={{
                                            float: "left",
                                            fontSize: 12,
                                            fontWeight: "600",
                                          }}
                                        >
                                          Save{" "}
                                          {parseFloat(
                                            subPlan.discountPercentage
                                          ).toFixed(0)}
                                          %
                                        </Typography>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    You will not be billed anything today. <br />
                    After your <strong>14 day free trial</strong>, you will be
                    charged unless you cancel your plan. <br />
                    Cancel Anytime.
                  </Grid>
                  {/* add payment method: card, stripe, paypal */}

                  <Grid item xs={12}>
                    <div className={classes.btnWrapper}>
                      <Buttons
                        className={classes.MuiButton}
                        fullWidth
                        disableElevation
                        type="submit"
                        disabled={userFormSubmitting}
                      >
                        <OfflineBoltOutlined className={classes.btnIcon} />
                        Start your 14 day Free Trial
                      </Buttons>
                      {userFormSubmitting && <Spinner size={24} />}
                    </div>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item xs={12} style={{ marginTop: "20px" }}>
              <Link href="/login" color="inherit">
                Already have an account? Login here.
              </Link>
            </Grid>

            <div className={classes.privacyPolicy}>
              <Typography className={classes.footerText}>Privacy</Typography>
              <div>|</div>
              <Typography className={classes.footerText}>
                Terms of Service
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreditCardForm;
