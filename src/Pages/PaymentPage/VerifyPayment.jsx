import axios from "axios";
import { useEffect, useState } from "react";
import { CheckCircleOutline } from "@mui/icons-material";
import { Alert } from "@mui/material";

export const PAYMENT_STATUS_STATE = {
  LOADING: "loading",
  PAID: "paid",
  NOT_PAID: "not paid",
  EXPIRED: "expired",
};

export default function VerifyPayment() {
  const [paymentStatus, setPaymentStatus] = useState(
    PAYMENT_STATUS_STATE.LOADING
  );

  const updatePaymentStatusIfPaid = async () => {
    try {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
      );
      const response = await axios.post(`/payment/session`, {
        token: sessionId,
      });
      setPaymentStatus(
        response.data.data.message === "Payment success"
          ? PAYMENT_STATUS_STATE.PAID
          : PAYMENT_STATUS_STATE.NOT_PAID
      );
    } catch (error) {
      setPaymentStatus(PAYMENT_STATUS_STATE.EXPIRED);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      updatePaymentStatusIfPaid();
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (paymentStatus === PAYMENT_STATUS_STATE.LOADING) {
    return <Alert severity="info">Fetching your payment success status</Alert>;
  }

  if (paymentStatus === PAYMENT_STATUS_STATE.PAID) {
    return (
      <div>
        <Alert
          icon={<CheckCircleOutline fontSize="inherit" />}
          severity="success"
        >
          Payment successful
        </Alert>
        <p>Payment was successful. You can now safely close this tab.</p>
      </div>
    );
  }

  if (paymentStatus === PAYMENT_STATUS_STATE.EXPIRED) {
    return <Alert severity="warning">Could not find your detail.</Alert>;
  }

  return <Alert severity="error">Payment Failed.</Alert>;
}
//migrated
