import React, { useEffect } from "react";
import { statusCheck } from "../api/api";

export default function EsewaSuccess() {
  useEffect(() => {
    // eSewa often returns Base64-encoded response in `data` param. Check actual param name.
    const query = new URLSearchParams(window.location.search);
    const encoded = query.get("data") || query.get("response") || null;

    if (encoded) {
      try {
        const decoded = atob(encoded);
        const parsed = JSON.parse(decoded);
        console.log("esewa decoded response:", parsed);

        // Optionally perform status check with backend (more reliable)
        const { product_code, total_amount, transaction_uuid } = parsed;
        statusCheck(product_code, total_amount, transaction_uuid)
          .then((res) => {
            console.log("Status check result:", res);
            // update UI / mark order completed in your system
          })
          .catch((err) => console.error(err));
      } catch (err) {
        console.error("Failed to decode/parse eSewa response:", err);
      }
    } else {
      // If eSewa uses POST redirect instead of query param: you'd need a server endpoint to receive POST
      console.warn(
        "No encoded data found in query string. Check eSewa response format."
      );
    }
  }, []);

  return (
    <div>Payment completed — processing... (check console for details)</div>
  );
}
