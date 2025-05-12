import VerifyPayment from "./VerifyPayment";

export default function VerifyPaymentPage() {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');

    if(sessionId) {
      return (
        <div style={{ minHeight: '88vh', padding: '15px 40px' }}>
          <h3>Payment Verification</h3>
          <VerifyPayment />
        </div>
      )
    }

    return (
      <div style={{ minHeight: '88vh', padding: '15px 40px' }}>
        <h3>No identification found</h3>  
      </div>
    )
}