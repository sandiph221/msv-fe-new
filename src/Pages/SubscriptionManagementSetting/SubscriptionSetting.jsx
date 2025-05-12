import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { withRouter } from 'react-router-dom';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from 'axios';
import Alert from 'Components/AlertBox/Alert';
import { useEffect, useState } from 'react';
import Layout from '../../Components/Layout';
import styles from './Styles';
import Buttons from 'Components/Buttons/Buttons';
import { Delete, Edit } from '@mui/icons-material';

const useStyles = makeStyles((theme) => styles(theme));

const SubscriptionSetting = ({ history }) => {
  const [plans, setPlans] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const classes = useStyles();

  const getSubscriptionPlans = async () => {
    try {
      const subscriptionPlans = await axios.get('/subscription-plans');

      if (subscriptionPlans) {
        setPlans(subscriptionPlans.data.data);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getSubscriptionPlans().catch(console.log);
  }, []);

  const handleCreatePlan = () => {
    history.push('/plan/create');
  };

  const handleEditPlan = (id) => {
    history.push(`/plan/${id}`);
  };

  const deletePlan = (data) => {
    setDeleteAlertOpen(true);
    setItemToDelete(data);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/subscription-plans/${itemToDelete.id}`);
      getSubscriptionPlans().catch(console.log);
    } catch (error) {
      console.log('error', error);
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
            marginInline: "auto"
          }}
        >
          <Typography
            variant='h4'
            gutterBottom
          >
            Subscription Management
          </Typography>

          <Buttons
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleCreatePlan}
            className={classes.button}
          >
            Create New Plan
          </Buttons>

          <TableContainer style={{
            marginTop: 24,
            boxShadow: 'none',
            border: '1px solid rgba(0,0,0,0.1)'
            }}
            component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans?.map((plan, index) => (
                  <TableRow key={index}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.description}</TableCell>
                    <TableCell align="right" style={{ display: 'flex', gap: 4 }}>
                      <button
                        className={classes.actionButton}
                        onClick={() => deletePlan(plan)}
                      >
                        <Delete/>
                      </button>
                      <button
                        className={classes.actionButton}
                        onClick={() => handleEditPlan(plan.id)}
                      >
                        <Edit/>
                      </button>
                      <Alert
                        alert={itemToDelete}
                        icon={
                          <ErrorOutlineIcon
                            style={{
                              fontSize: '5rem',
                              color: '#d53042',
                              paddingBottom: 0,
                            }}
                          />
                        }
                        title='Are you sure?'
                        confirmBtn='DELETE'
                        description="You're about to Delete the plan. This process cannot be undone."
                        open={deleteAlertOpen}
                        setOpen={setDeleteAlertOpen}
                        onConfirm={handleDelete}
                        buttonbgcolor='#d53042'
                        textColor='#fff'
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Grid>
    </Layout>
  );
};

export default withRouter(SubscriptionSetting);
