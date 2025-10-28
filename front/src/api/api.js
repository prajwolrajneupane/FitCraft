export async function createSignature(
  total_amount,
  transaction_uuid,
  product_code
) {
  const res = await fetch("http://localhost:4000/api/generate-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ total_amount, transaction_uuid, product_code }),
  });
  if (!res.ok) throw new Error("Failed to create signature");
  return res.json();
}

export async function statusCheck(
  product_code,
  total_amount,
  transaction_uuid
) {
  const url = `http://localhost:4000/api/status-check?product_code=${encodeURIComponent(
    product_code
  )}&total_amount=${encodeURIComponent(
    total_amount
  )}&transaction_uuid=${encodeURIComponent(transaction_uuid)}`;
  const res = await fetch(url);
  return res.json();
}
