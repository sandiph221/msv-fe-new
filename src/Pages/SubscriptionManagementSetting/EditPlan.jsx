import { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  IconButton,
  MenuItem,
  makeStyles,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../../Components/Layout";
import styles from "./Styles";
import axios from "axios";
import Buttons from "Components/Buttons/Buttons";
import Editor from "react-simple-wysiwyg";
import { Add } from "@mui/icons-material";

const useStyles = makeStyles((theme) => styles(theme));

const EditPlan = ({ history, match }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    subscription_details: [],
  });

  const durationOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "semi-annually", label: "Semi-Annually" },
    { value: "annually", label: "Annually" },
  ];

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        // Replace this with your actual API call
        const response = await axios.get(
          `/subscription-plans/${match.params.id}`
        );
        const data = response.data.data;

        setFormValues({
          name: data.name,
          description: data.description,
          subscription_details: data.SubscriptionPlans,
        });
      } catch (error) {
        console.error("Error fetching plan:", error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [match.params.id]);

  const handleAddSubscriptionDetail = () => {
    setFormValues((prevState) => ({
      ...prevState,
      subscription_details: [
        ...prevState.subscription_details,
        {
          duration: "monthly",
          price: 0,
          discountPercentage: 0,
        },
      ],
    }));
  };

  const handleSubscriptionDetailChange = (index, field, value) => {
    setFormValues((prevState) => {
      const newDetails = [...prevState.subscription_details];
      newDetails[index] = {
        ...newDetails[index],
        [field]: value,
      };
      return {
        ...prevState,
        subscription_details: newDetails,
      };
    });
  };

  const handleRemoveSubscriptionDetail = (index) => {
    setFormValues((prevState) => ({
      ...prevState,
      subscription_details: prevState.subscription_details.filter(
        (_, idx) => idx !== index
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/subscription-plans/${match.params.id}`, formValues);
      history.push("/subscription-management");
    } catch (error) {
      console.error("Error updating plan:", error);
      // Handle error appropriately
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Grid container className={classes.root}>
        <div
          style={{
            marginTop: 100,
            marginBottom: 30,
            width: "100%",
            padding: "8px 50px",
            marginInline: "auto",
          }}
        >
          <Paper className={classes.paper}>
            <Typography variant="h4" gutterBottom>
              Edit Subscription Plan
            </Typography>

            <form onSubmit={handleSubmit}>
              <div className={classes.pageHeader}>
                <Typography style={{ fontSize: 14, fontWeight: 500 }}>
                  Plan Name
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Plan Name"
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className={classes.pageHeader}>
                <Typography style={{ fontSize: 14, fontWeight: 500 }}>
                  Description
                </Typography>
                <Editor
                  placeholder="Description"
                  value={formValues.description}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <Box className={classes.formSection}>
                <Typography variant="h6" gutterBottom>
                  Subscription Details
                </Typography>
                {formValues.subscription_details?.map((detail, index) => (
                  <Box
                    key={index}
                    style={{ marginBlock: 24 }}
                    className={classes.subscriptionDetail}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveSubscriptionDetail(index)}
                      className={classes.deleteButton}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <TextField
                      select
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Duration"
                      value={detail.duration}
                      onChange={(e) =>
                        handleSubscriptionDetailChange(
                          index,
                          "duration",
                          e.target.value
                        )
                      }
                      margin="normal"
                      style={{ marginTop: 30 }}
                      required
                    >
                      {durationOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      type="number"
                      label="Price"
                      value={detail.price}
                      onChange={(e) =>
                        handleSubscriptionDetailChange(
                          index,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      margin="normal"
                      required
                    />

                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      type="number"
                      label="Discount Percentage"
                      value={detail.discountPercentage}
                      onChange={(e) =>
                        handleSubscriptionDetailChange(
                          index,
                          "discountPercentage",
                          Number(e.target.value)
                        )
                      }
                      margin="normal"
                      InputProps={{
                        inputProps: { min: 0, max: 100 },
                      }}
                    />
                  </Box>
                ))}
                <Buttons
                  variant="outlined"
                  color="primary"
                  onClick={handleAddSubscriptionDetail}
                  className={classes.addSection}
                >
                  <Add />
                  Add Subscription Detail
                </Buttons>
              </Box>

              <Box className={classes.buttonGroup}>
                <Buttons
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Update Plan
                </Buttons>
                <Button
                  variant="outlined"
                  onClick={() => history.push("/subscription-management")}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Paper>
        </div>
      </Grid>
    </Layout>
  );
};

export default withRouter(EditPlan);
