import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Checkout() {
  const formRef = useRef();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const amount = "100"; // Item price
    const tax_amount = "10";
    const product_service_charge = "0";
    const product_delivery_charge = "0";
    const total_amount = (
      Number(amount) +
      Number(tax_amount) +
      Number(product_service_charge) +
      Number(product_delivery_charge)
    ).toFixed(2);

    const transaction_uuid = `txn-${Date.now()}`;
    const product_code = "EPAYTEST";

    // Call backend to get signature
    axios
      .post("http://localhost:5000/api/generate-signature", {
        total_amount,
        transaction_uuid,
        product_code,
        tax_amount,
        product_service_charge,
        product_delivery_charge,
      })
      .then((res) => {
        setFormData({
          ...res.data,
          amount,
          tax_amount,
          total_amount,
          product_service_charge,
          product_delivery_charge,
          transaction_uuid,
          success_url: `${window.location.origin}/esewa-success`,
          failure_url: `${window.location.origin}/esewa-failure`,
        });
      })
      .catch((err) => console.error("Signature error:", err));
  }, []);

  useEffect(() => {
    if (formData && formRef.current) {
      // Auto-submit the form to eSewa
      formRef.current.submit();
    }
  }, [formData]);

  if (!formData) return <div>Preparing payment...</div>;

  return (
    <form
      ref={formRef}
      action={formData.form_url}
      method="POST"
      style={{ display: "none" }}>
      <input type="hidden" name="amount" value={formData.amount} />
      <input type="hidden" name="tax_amount" value={formData.tax_amount} />
      <input
        type="hidden"
        name="product_service_charge"
        value={formData.product_service_charge}
      />
      <input
        type="hidden"
        name="product_delivery_charge"
        value={formData.product_delivery_charge}
      />
      <input type="hidden" name="total_amount" value={formData.total_amount} />
      <input
        type="hidden"
        name="transaction_uuid"
        value={formData.transaction_uuid}
      />
      <input type="hidden" name="product_code" value={formData.product_code} />
      <input
        type="hidden"
        name="signed_field_names"
        value={formData.signed_field_names}
      />
      <input type="hidden" name="signature" value={formData.signature} />
      <input type="hidden" name="success_url" value={formData.success_url} />
      <input type="hidden" name="failure_url" value={formData.failure_url} />
      <noscript>
        <button type="submit">Continue to eSewa</button>
      </noscript>
    </form>
  );
}
