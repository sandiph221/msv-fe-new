import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  makeStyles,
  useTheme
} from '@mui/material';
import axios from 'axios';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { sentenceCase } from 'utils/string';
import Layout from '../../Components/Layout';
import styles from './Styles';

const useStyles = makeStyles((theme) => styles(theme));

const SubscriptionDetail = (props) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [currentSubscription, setCurrentSubscription] = useState();
  const [plans, setPlans] = useState([]);

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

  const classes = useStyles();
  const fetchCurrentSubscription = async () => {
    const currentSubscription = await axios.get('/subscription')
    setCurrentSubscription(currentSubscription.data.data)
  }

  useEffect(() => {
    fetchCurrentSubscription().catch(console.log)
    getSubscriptionPlans().catch(console.log)
  }, [])


  if(!currentSubscription || !plans.length) {
    return <CircularProgress />
  }

  const currentPlan = currentSubscription ? plans.find(plan => !!(plan.PlanTypePrices ?? []).some(a => a.id  === currentSubscription?.plan_type_price_id)) : null
  const currentPlanPrice = currentPlan ? currentPlan.PlanTypePrices.find(a => a.id  === currentSubscription?.plan_type_price_id) : null

  return (
    <Layout>
      <Grid
        className={classes.row}
        container
        md={12}
        spacing={0}
      >
        <Container
          maxWidth='lg'
          lg={12}
          md={12}
          xs={12}
        >
          <Box style={{ marginTop: '20px' }}>
            <Typography
              variant='h2'
              className={classes.heading}
            >
              Subscription and Billing
            </Typography>
            <Typography style={{ fontSize: '12px' }}>
              Manage and Update subscription and billing information
            </Typography>
          </Box>
          <Box className={classes.box}>
            <Typography className={classes.userType}>
              <strong>Subscription Information</strong>
            </Typography>

            <Grid
              item
              xs={12}
            >
              <Grid
                container
                spacing={2}
              >
                {/* actual profile form component */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  <Typography className={classes.text}>
                    Subscription Start Date:{' '}
                    {moment(currentSubscription.subscription_starts_at).format('DD MMMM, YYYY')}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                >
                <pre>

                </pre>
                  <Typography className={classes.text}>
                    Subscription Plan:{' '}
                    {sentenceCase(
                      currentPlan?.name
                    ) ?? ''}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  <Typography className={classes.text}>
                    Subscription Price: $
                    {currentPlanPrice?.price ?? ''}
                    /{currentPlanPrice?.duration}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  <Typography className={classes.text}>
                    Discount:{' '}
                    {currentPlanPrice?.discount ?? 0}%
                  </Typography>
                </Grid>
                {currentSubscription.trial_ends_at && (
                <>
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <Typography className={classes.text}>
                      Trial Ends Date:{' '}
                      {moment(currentSubscription.trial_ends_at).format('DD MMMM, YYYY')}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <Typography className={classes.text}>
                      Trial left duration:{' '}
                      {moment(user.trial_end_at).diff(moment(), 'days') + 1 >= 0
                        ? moment(user.trial_end_at).diff(moment(), 'days') +
                          1 +
                          ' days'
                        : 'Trial is expired'}
                    </Typography>
                  </Grid>
                </>
                )}
                {/* Add upgrade/downgrade plan logic here */}
                <Grid
                  container
                  xs={10}
                  style={{
                    padding: '20px 12px',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    type='submit'
                    variant='contained'
                    color="secondary"
                    className={classes.button}
                    onClick={() => props.history.push('/upgrade')}
                  >
                    Change Plan
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={2}
                ></Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>

      </Grid>
    </Layout>
  );
};

export default SubscriptionDetail;
