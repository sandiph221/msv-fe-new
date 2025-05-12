import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Slide,
  Typography,
  makeStyles,
} from "@mui/material";
import axios from "axios";
import PlanDisplay from "Components/Subscription/PlanDisplay";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../Components/Layout";
import styles from "./Styles";
import Buttons from "Components/Buttons/Buttons";

const useStyles = makeStyles((theme) => styles(theme));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpgradePlan = (props) => {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState();
  const [selectedPlan, setSelectedPlan] = useState();
  const classes = useStyles();

  const handleClose = () => {
    setSelectedPlan(null);
  };

  const getSubscriptionPlans = async () => {
    try {
      const subscriptionPlans = await axios.get("/subscription-plans");

      if (subscriptionPlans) {
        setPlans(subscriptionPlans.data.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchCurrentSubscription = async () => {
    const currentSubscription = await axios.get("/subscription");
    setCurrentSubscription(currentSubscription.data.data);
  };

  useEffect(() => {
    fetchCurrentSubscription().catch(console.log);
    getSubscriptionPlans().catch(console.log);
  }, []);

  const handlePlanChoose = async (priceItem, { anotherCard }) => {
    try {
      handleClose();

      const response = await axios.post(`/subscription-upgrade`, {
        newPlanTypePriceId: priceItem.id,
        sameCard: !anotherCard,
      });

      console.log(response.data);

      if (response.data.data.url) {
        window.open(response.data.data.url, "_blank");
      } else {
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Layout>
      <div
        style={{
          marginTop: 100,
          marginBottom: 30,
          width: "100%",
          padding: "8px 50px",
          marginInline: "auto",
        }}
      >
        <Box className={classes.box}>
          <div className={classes.flexRow}>
            <Typography variant="h2" className={classes.heading}>
              Subscription Details
            </Typography>
          </div>

          <Divider style={{ marginBlock: 20 }} />

          <Grid container spacing={3}>
            <PlanDisplay
              onPlanClick={(priceItem) => {
                const selectedPlan = plans.find((plan) =>
                  plan.PlanTypePrices.find((price) => price.id === priceItem.id)
                );
                setSelectedPlan({
                  price: priceItem,
                  plan: {
                    id: selectedPlan.id,
                    name: selectedPlan.name,
                    description: selectedPlan.description,
                  },
                });
              }}
              plans={plans}
              currentPlanId={currentSubscription?.plan_type_price_id}
            />
          </Grid>
        </Box>
      </div>
      <Dialog
        open={!!selectedPlan}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {selectedPlan && (
          <>
            <DialogTitle>{"Change Curren Plan?"}</DialogTitle>
            <DialogContent>
              <DialogContentText
                style={{ margin: 20 }}
                id="alert-dialog-slide-description"
              >
                Are you sure you want to change your current plan?
                <br />
                If you want to proceed with the selected plan, click on Proceed.
                <br />
                <div style={{ marginTop: 20 }}>
                  Plan Name: <b>{selectedPlan.plan.name}</b>
                  <br />
                  Billing Cycle: <b>{selectedPlan.price.duration}</b>.
                  <br />
                  Price: Aud. <b>{selectedPlan.price.price}</b>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{ margin: 20 }}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Buttons
                variant="outlined"
                color="secondary"
                onClick={() =>
                  handlePlanChoose(selectedPlan.price, { anotherCard: true })
                }
              >
                Procced With Another Card
              </Buttons>
              <Buttons
                variant="outlined"
                color="secondary"
                onClick={() =>
                  handlePlanChoose(selectedPlan.price, { anotherCard: false })
                }
              >
                Proceed
              </Buttons>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Layout>
  );
};

export default UpgradePlan;
