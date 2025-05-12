import { Divider } from "@mui/material";
import axios from "axios";
import { Footer } from "Components/Footer/Footer";
import PlanDisplay from "Components/Subscription/PlanDisplay";
import { useEffect, useState } from "react";

export default function NotPaidDashboard({ hasPaid }) {
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

  useEffect(() => {
    getSubscriptionPlans().catch(console.error)
  }, [])

  const handlePlanChoose = async (plan) => {
    try {
      const response = await axios.post(`/subscription/${plan.id}`);
      if(response.data.data.url) {
        window.open(response.data.data.url, '_blank')
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ minHeight: '100%', padding: '40px 40px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ textAlign: 'center' }}>Select a plan to start using the application</h1>
        <PlanDisplay onPlanClick={handlePlanChoose} plans={plans} />
      </div>
      <Footer />
    </div>
  )
}
