import {
  Grid,
  Paper,
  MenuItem,
  Select,
  Typography,
  useTheme,
  makeStyles,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Layout from "Components/Layout";
import axios from "axios";

// Use makeStyles instead of styled for Material-UI v4
const useStyles = makeStyles((theme) => ({
  container: {
    padding: "32px 50px",
    marginTop: 72,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 24,
    marginBottom: 32,
  },
  statCard: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(0, 0, 0, 0.23)",
    boxShadow: "none",
    "&:hover $statValue": {
      color: "#f4d45f",
    },
  },
  chartContainer: {
    marginBottom: 32,
    padding: 24,
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(0, 0, 0, 0.23)",
    boxShadow: "none",
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  roleFilter: {
    minWidth: 150,
    height: 40,
  },
  chartWrapper: {
    width: "100%",
    height: 400,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 600,
    marginBottom: 8,
    color: "#FBE281",
  },
  statLabel: {
    color: theme.palette.text.secondary,
  },
}));

function Analytics() {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState("super-admin");
  const [userStats, setUserStats] = useState([]);
  const [subscriptionStats, setSubscriptionStats] = useState({
    subscriptions: [],
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user analytics
    const fetchUserAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/stats/user${selectedRole !== "all" ? `?role=${selectedRole}` : ""}`
        );
        if (response.data && response.data.data) {
          setUserStats(response.data.data);
        } else {
          setUserStats([]);
        }
      } catch (error) {
        console.error("Error fetching user analytics:", error);
        setUserStats([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch subscription analytics
    const fetchSubscriptionAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/stats/subscriptions");
        if (response.data && response.data.data) {
          setSubscriptionStats(response.data.data);
        } else {
          setSubscriptionStats({ subscriptions: [], revenue: 0 });
        }
      } catch (error) {
        console.error("Error fetching subscription analytics:", error);
        setSubscriptionStats({ subscriptions: [], revenue: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAnalytics();
    fetchSubscriptionAnalytics();
  }, [selectedRole]);

  const totalUsers = userStats.reduce((acc, curr) => acc + curr.count, 0);
  const totalSubscriptions =
    subscriptionStats.subscriptions?.reduce(
      (acc, curr) => acc + curr.count,
      0
    ) || 0;
  const totalRevenue = subscriptionStats.revenue || 0;

  return (
    <Layout>
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Analytics Dashboard
          </Typography>
        </div>

        {/* Stats Cards */}
        <div className={classes.statsGrid}>
          <Paper className={classes.statCard}>
            <Typography className={classes.statValue}>{totalUsers}</Typography>
            <Typography className={classes.statLabel}>Total Users</Typography>
          </Paper>
          <Paper className={classes.statCard}>
            <Typography className={classes.statValue}>
              {totalSubscriptions}
            </Typography>
            <Typography className={classes.statLabel}>
              Active Subscriptions
            </Typography>
          </Paper>
          <Paper className={classes.statCard}>
            <Typography className={classes.statValue}>
              ${totalRevenue}
            </Typography>
            <Typography className={classes.statLabel}>Total Revenue</Typography>
          </Paper>
        </div>

        {/* User Analytics */}
        <Paper className={classes.chartContainer}>
          <div className={classes.chartHeader}>
            <Typography variant="h6">User Growth</Typography>
            <Select
              className={classes.roleFilter}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              variant="outlined"
              size="small"
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="super-admin">Super Admin</MenuItem>
              <MenuItem value="customer-admin">Customer Admin</MenuItem>
              <MenuItem value="customer-viewer">Customer Viewer</MenuItem>
            </Select>
          </div>
          <div className={classes.chartWrapper}>
            <ResponsiveContainer>
              {userStats.length > 0 ? (
                <LineChart data={userStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="joinedDate" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={"#FBE281"}
                    name="Users"
                  />
                </LineChart>
              ) : (
                <Typography align="center" style={{ marginTop: "150px" }}>
                  No user data available
                </Typography>
              )}
            </ResponsiveContainer>
          </div>
        </Paper>

        {/* Subscription Analytics */}
        <Paper className={classes.chartContainer}>
          <Typography variant="h6" gutterBottom>
            Subscription Distribution
          </Typography>
          <div className={classes.chartWrapper}>
            <ResponsiveContainer>
              {subscriptionStats.subscriptions &&
              subscriptionStats.subscriptions.length > 0 ? (
                <BarChart data={subscriptionStats.subscriptions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="planName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={"#FBE281"} name="Subscriptions" />
                </BarChart>
              ) : (
                <Typography align="center" style={{ marginTop: "150px" }}>
                  No subscription data available
                </Typography>
              )}
            </ResponsiveContainer>
          </div>
        </Paper>
      </div>
    </Layout>
  );
}

export default Analytics;
