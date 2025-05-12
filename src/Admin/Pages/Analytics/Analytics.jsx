import {
  Grid,
  Paper,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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

// Styled components using MUI's styled API
const Container = styled("div")(({ theme }) => ({
  padding: "32px 50px",
}));

const Header = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
});

const StatsGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 24,
  marginBottom: 32,
});

const StatCard = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  border: "1px solid rgba(0, 0, 0, 0.23)",
  boxShadow: "none",
  "&:hover .statValue": {
    color: "#f4d45f",
  },
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  marginBottom: 32,
  padding: 24,
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  border: "1px solid rgba(0, 0, 0, 0.23)",
  boxShadow: "none",
}));

const ChartHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
});

const RoleFilter = styled(Select)({
  minWidth: 150,
  height: 40,
});

const ChartWrapper = styled("div")({
  width: "100%",
  height: 400,
});

const StatValue = styled(Typography)({
  fontSize: 32,
  fontWeight: 600,
  marginBottom: 8,
  color: "#FBE281",
});

const StatLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Analytics() {
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState("super-admin");
  const [userStats, setUserStats] = useState([]);
  const [subscriptionStats, setSubscriptionStats] = useState([]);

  useEffect(() => {
    // Fetch user analytics
    const fetchUserAnalytics = async () => {
      try {
        const data = await axios.get(
          `/stats/user${selectedRole !== "all" ? `?role=${selectedRole}` : ""}`
        );
        console.log(data.data);
        setUserStats(data.data.data);
      } catch (error) {
        console.error("Error fetching user analytics:", error);
      }
    };

    // Fetch subscription analytics
    const fetchSubscriptionAnalytics = async () => {
      try {
        const data = await axios.get("/stats/subscriptions");
        setSubscriptionStats(data.data.data);
      } catch (error) {
        console.error("Error fetching subscription analytics:", error);
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
    ) ?? 0;
  const totalRevenue = subscriptionStats.revenue;

  return (
    <Layout>
      <Container style={{ marginTop: 72 }}>
        <Header>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Analytics Dashboard
          </Typography>
        </Header>

        {/* Stats Cards */}
        <StatsGrid>
          <StatCard>
            <StatValue className="statValue">{totalUsers}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue className="statValue">{totalSubscriptions}</StatValue>
            <StatLabel>Active Subscriptions</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue className="statValue">${totalRevenue}</StatValue>
            <StatLabel>Total Revenue</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* User Analytics */}
        <ChartContainer>
          <ChartHeader>
            <Typography variant="h6">User Growth</Typography>
            <RoleFilter
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              variant="outlined"
              size="small"
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="super-admin">Super Admin</MenuItem>
              <MenuItem value="customer-admin">Customer Admin</MenuItem>
              <MenuItem value="customer-viewer">Customer Viewer</MenuItem>
            </RoleFilter>
          </ChartHeader>
          <ChartWrapper>
            <ResponsiveContainer>
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
            </ResponsiveContainer>
          </ChartWrapper>
        </ChartContainer>

        {/* Subscription Analytics */}
        <ChartContainer>
          <Typography variant="h6" gutterBottom>
            Subscription Distribution
          </Typography>
          <ChartWrapper>
            <ResponsiveContainer>
              <BarChart data={subscriptionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="planName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={"#FBE281"} name="Subscriptions" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </ChartContainer>
      </Container>
    </Layout>
  );
}

export default Analytics;
