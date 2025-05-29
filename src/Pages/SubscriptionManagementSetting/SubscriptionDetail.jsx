import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Typography,
    makeStyles,
    useTheme,
    Chip,
    Card,
    CardContent,
    Divider,
    Paper
} from '@material-ui/core';
import axios from 'axios';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { sentenceCase } from 'utils/string';
import Layout from '../../Components/Layout';
import { useNavigate } from 'react-router-dom';
import styles from './Styles';

const useStyles = makeStyles((theme) => ({
    ...styles(theme),
    compactCard: {
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2),
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    label: {
        fontWeight: 500,
        color: theme.palette.text.secondary,
        minWidth: '140px',
    },
    value: {
        color: theme.palette.text.primary,
        textAlign: 'right',
        flex: 1,
    },
    statusChip: {
        marginLeft: theme.spacing(1),
    },
    paymentCard: {
        marginBottom: theme.spacing(1),
        padding: theme.spacing(1.5),
    },
}));

const SubscriptionDetail = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [loading, setLoading] = useState(true);

    const classes = useStyles();

    const fetchSubscriptionData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/subscription');
            if (response.data && response.data.data) {
                setSubscriptionData(response.data.data);
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptionData();
    }, []);

    const formatCurrency = (amount, currency = 'AUD') => {
        if (!amount && amount !== 0) return 'N/A';

        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numericAmount)) return 'N/A';

        const currencyCode = currency || 'AUD';

        try {
            return new Intl.NumberFormat('en-AU', {
                style: 'currency',
                currency: currencyCode.toUpperCase(),
            }).format(numericAmount);
        } catch (error) {
            return `$${numericAmount.toFixed(2)}`;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return moment(dateString).format('DD MMM, YYYY');
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return moment(dateString).format('DD MMM, YYYY HH:mm');
    };

    const getTrialDaysLeft = (trialEndDate) => {
        if (!trialEndDate) return 'N/A';
        const daysLeft = moment(trialEndDate).diff(moment(), 'days') + 1;
        return daysLeft >= 0 ? `${daysLeft} days` : 'Expired';
    };

    const InfoRow = ({ label, value, chip }) => (
        <Box className={classes.infoRow}>
            <Typography className={classes.label}>{label}:</Typography>
            <Box className={classes.value}>
                <Typography component="span">{value || 'N/A'}</Typography>
                {chip && <Chip size="small" className={classes.statusChip} {...chip} />}
            </Box>
        </Box>
    );

    if (loading || !subscriptionData) {
        return (
            <Container maxWidth='lg'>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    const currentSubscription = subscriptionData.Subscriptions?.[0];
    const planTypePrice = currentSubscription?.PlanTypePrice;
    const planType = planTypePrice?.PlanType;
    const stripeCustomer = subscriptionData.payment_system_details?.stripe?.customer;

    return (
        <Container maxWidth='lg'>
            <Box style={{ marginTop: '20px', marginBottom: '20px' }}>
                <Typography variant='h2' className={classes.heading}>
                    Subscription and Billing
                </Typography>
                <Typography style={{ fontSize: '12px' }}>
                    Manage and Update subscription and billing information
                </Typography>
            </Box>

            <Grid container spacing={3}>
                
                {/* Subscription Information */}
                <Grid item xs={12} md={6}>
                    {currentSubscription ? (
                        <Paper className={classes.compactCard}>
                            <Typography variant="h6" className={classes.sectionTitle}>
                                Subscription Details
                            </Typography>
                            <InfoRow label="Plan" value={planType?.name} />
                            <InfoRow label="Description" value={planType?.description} />
                            <InfoRow
                                label="Price"
                                value={`${formatCurrency(planTypePrice?.price)} / ${planTypePrice?.duration || ''}`}
                            />
                            <InfoRow label="Discount" value={`${planTypePrice?.discount_percentage || 0}%`} />
                            <InfoRow label="Provider" value={sentenceCase(currentSubscription.provider)} />
                            <InfoRow label="Started" value={formatDate(currentSubscription.created_at)} />
                            <InfoRow
                                label="Status"
                                value=""
                                chip={{
                                    label: currentSubscription.isTrial ? 'Trial' : (currentSubscription.is_active ? 'Active' : 'Inactive'),
                                    color: currentSubscription.isTrial ? 'primary' : (currentSubscription.is_active ? 'secondary' : 'default')
                                }}
                            />
                        </Paper>
                    ) : (
                        <Paper className={classes.compactCard}>
                            <Typography variant="h6" className={classes.sectionTitle}>
                                Subscription Details
                            </Typography>
                            <Typography>No active subscription found</Typography>
                        </Paper>
                    )}
                </Grid>

                {/* Trial Information */}
                {currentSubscription?.isTrial && (
                    <Grid item xs={12} md={6}>
                        <Paper className={classes.compactCard}>
                            <Typography variant="h6" className={classes.sectionTitle}>
                                Trial Information
                            </Typography>
                            <InfoRow label="Trial Ends" value={formatDate(currentSubscription.trial_ends_at)} />
                            <InfoRow label="Days Left" value={getTrialDaysLeft(currentSubscription.trial_ends_at)} />
                            {currentSubscription.subscription_ends_at && (
                                <InfoRow label="Subscription Ends" value={formatDate(currentSubscription.subscription_ends_at)} />
                            )}
                        </Paper>
                    </Grid>
                )}


                {/* Payment History */}
                <Grid item xs={12}>
                    <Paper className={classes.compactCard}>
                        <Typography variant="h6" className={classes.sectionTitle}>
                            Payment History
                        </Typography>
                        {subscriptionData.Payments && subscriptionData.Payments.length > 0 ? (
                            <Grid container spacing={2}>
                                {subscriptionData.Payments.map((payment, index) => (
                                    <Grid item xs={12} md={6} lg={4} key={payment.id || index}>
                                        <Card variant="outlined" className={classes.paymentCard}>
                                            <CardContent style={{ padding: '12px', '&:last-child': { paddingBottom: '12px' } }}>
                                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                    <Typography variant="subtitle2">
                                                        Payment #{payment.id}
                                                    </Typography>
                                                    <Chip
                                                        label={sentenceCase(payment.status)}
                                                        size="small"
                                                        color={payment.status === 'completed' ? 'secondary' : 'default'}
                                                    />
                                                </Box>
                                                <Typography variant="body2" color="textSecondary">
                                                    Amount: {formatCurrency(payment.amount, payment.currency)}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Date: {formatDate(payment.payment_date)}
                                                </Typography>
                                                {payment.note && (
                                                    <Typography variant="body2" color="textSecondary">
                                                        Note: {payment.note}
                                                    </Typography>
                                                )}
                                                {payment.invoice?.hosted_invoice_url && (
                                                    <Box mt={1}>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => window.open(payment.invoice.hosted_invoice_url, '_blank')}
                                                        >
                                                            View Invoice
                                                        </Button>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography color="textSecondary">
                                No payment history available
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            variant='contained'
                            color="secondary"
                            className={classes.button}
                            onClick={() => navigate('/user/upgrade')}
                            size="large"
                        >
                            Change Plan
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SubscriptionDetail;
  