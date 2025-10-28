import React, { useEffect } from "react";
export default function EsewaFailure() {
  useEffect(() => {
    console.log("Payment failed or was cancelled");
  }, []);
  return <div>Payment failed or cancelled. Please try again.</div>;
}
