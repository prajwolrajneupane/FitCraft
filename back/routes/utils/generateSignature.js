import crypto from "crypto";

export function generateSignature(
  total_amount,
  transaction_uuid,
  product_code,
  amount,
  tax_amount,
  product_service_charge,
  product_delivery_charge
) {
  const secretKey = process.env.ESEWA_SECRET_KEY;

  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},amount=${amount},tax_amount=${tax_amount},product_service_charge=${product_service_charge},product_delivery_charge=${product_delivery_charge}`;

  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(message);
  return hmac.digest("base64");
}
