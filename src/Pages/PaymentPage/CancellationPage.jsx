import { useEffect } from "react";

export default function PaymentCancelledPage() {
    useEffect(() => {
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    })

    return (
      <div style={{ minHeight: '88vh', padding: '15px 40px' }}>
        <h3>Looks like you cancelled to pay. Redirecting to payment plan selection</h3>
      </div>
    )
}