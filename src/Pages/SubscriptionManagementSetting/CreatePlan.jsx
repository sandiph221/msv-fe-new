// CreatePlan.js
import { useState } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../../Components/Layout";
import styles from "./Styles";
import axios from "axios";
import Buttons from "Components/Buttons/Buttons";
import { Add } from "@mui/icons-material";

const useStyles = makeStyles((theme) => styles(theme));

const CreatePlan = ({ history }) => {
  const classes = useStyles();

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
      await axios.post("/subscription-plans", formValues);
      history.push("/subscription-management");
    } catch (error) {
      console.error("Error creating plan:", error);
      // Handle error appropriately
    }
  };

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
              Create New Subscription Plan
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
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Description"
                  value={formValues.description}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      description: e.target.value,
                    })
                  }
                  multiline
                  required
                />
              </div>

              <Box className={classes.formSection}>
                <Typography variant="h6" gutterBottom>
                  Subscription Details
                </Typography>
                {formValues.subscription_details.map((detail, index) => (
                  <Box
                    key={index}
                    style={{ marginBottom: 20 }}
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
                      type="number"
                      variant="outlined"
                      size="small"
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
                      type="number"
                      variant="outlined"
                      size="small"
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

              <Box
                className={classes.buttonGroup}
                style={{ display: "flex", gap: 12, justifyContent: "end" }}
              >
                <Button
                  variant="outlined"
                  onClick={() => history.push("/subscription-management")}
                >
                  Cancel
                </Button>
                <Buttons
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.addSection}
                >
                  Create Plan
                </Buttons>
              </Box>
            </form>
          </Paper>
        </div>
      </Grid>
    </Layout>
  );
};

export default withRouter(CreatePlan);
