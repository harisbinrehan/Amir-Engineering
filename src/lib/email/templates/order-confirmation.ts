import { siteConfig } from "@/lib/content/site-config";
import { formatPkr } from "@/lib/utils/currency";

type OrderEmailItem = {
  product_name: string;
  variant_label: string | null;
  quantity: number;
  line_total: number;
};

export type OrderConfirmationEmailInput = {
  contactName: string;
  orderNumber: string;
  items: OrderEmailItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: "cod" | "bank_transfer";
  /** Present only for a brand-new account — link to set a password. */
  setPasswordUrl?: string;
  /** Present only when signing in wasn't safe to do automatically (existing account). */
  signInUrl?: string;
};

const BRAND = {
  dark: "#1a1d23",
  cream: "#f7f6f3",
  green: "#3f6f52",
  greenDark: "#2f5540",
  border: "#e4e1da",
  muted: "#6b6f76",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildOrderConfirmationEmail(input: OrderConfirmationEmailInput) {
  const {
    contactName,
    orderNumber,
    items,
    subtotal,
    shippingFee,
    total,
    paymentMethod,
    setPasswordUrl,
    signInUrl,
  } = input;

  const paymentLabel = paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer";

  const itemsRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};">
            <div style="font-weight:600;color:${BRAND.dark};font-size:14px;">${escapeHtml(item.product_name)}</div>
            ${item.variant_label ? `<div style="color:${BRAND.muted};font-size:13px;margin-top:2px;">${escapeHtml(item.variant_label)}</div>` : ""}
            <div style="color:${BRAND.muted};font-size:13px;margin-top:2px;">Qty ${item.quantity}</div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};text-align:right;font-weight:600;color:${BRAND.dark};font-size:14px;white-space:nowrap;">
            ${formatPkr(item.line_total)}
          </td>
        </tr>`,
    )
    .join("");

  const actionButton = setPasswordUrl
    ? `
      <div style="margin-top:28px;background:${BRAND.cream};border-radius:8px;padding:20px;text-align:center;">
        <p style="margin:0 0 14px;color:${BRAND.dark};font-size:14px;">
          We've set up an account for you so you can track this and future orders.
        </p>
        <a href="${setPasswordUrl}" style="display:inline-block;background:${BRAND.green};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:6px;">
          Set Your Password
        </a>
      </div>`
    : signInUrl
      ? `
      <div style="margin-top:28px;background:${BRAND.cream};border-radius:8px;padding:20px;text-align:center;">
        <p style="margin:0 0 14px;color:${BRAND.dark};font-size:14px;">
          You already have an account with us — sign in to view this order any time.
        </p>
        <a href="${signInUrl}" style="display:inline-block;background:${BRAND.green};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:6px;">
          Sign In to View Order
        </a>
      </div>`
      : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BRAND.cream};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="background:${BRAND.dark};padding:24px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.02em;">${escapeHtml(siteConfig.name)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 8px;color:${BRAND.dark};font-size:22px;">Order Confirmed</h1>
                <p style="margin:0 0 24px;color:${BRAND.muted};font-size:14px;line-height:1.6;">
                  Thank you, ${escapeHtml(contactName)}. We've received your order and will be in touch to confirm delivery.
                </p>

                <div style="background:${BRAND.cream};border-radius:8px;padding:14px 18px;margin-bottom:24px;">
                  <div style="color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:0.04em;">Order Number</div>
                  <div style="color:${BRAND.dark};font-size:18px;font-weight:700;margin-top:2px;">${escapeHtml(orderNumber)}</div>
                </div>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${itemsRows}
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                  <tr>
                    <td style="padding:4px 0;color:${BRAND.muted};font-size:13px;">Subtotal</td>
                    <td style="padding:4px 0;text-align:right;color:${BRAND.dark};font-size:13px;">${formatPkr(subtotal)}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:${BRAND.muted};font-size:13px;">Shipping</td>
                    <td style="padding:4px 0;text-align:right;color:${BRAND.dark};font-size:13px;">${formatPkr(shippingFee)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0 0;color:${BRAND.dark};font-size:15px;font-weight:700;border-top:1px solid ${BRAND.border};">Total</td>
                    <td style="padding:8px 0 0;text-align:right;color:${BRAND.dark};font-size:15px;font-weight:700;border-top:1px solid ${BRAND.border};">${formatPkr(total)}</td>
                  </tr>
                </table>

                <p style="margin:20px 0 0;color:${BRAND.muted};font-size:13px;">
                  Payment method: ${paymentLabel}${paymentMethod === "bank_transfer" ? " — our team will share bank details shortly." : ""}
                </p>

                ${actionButton}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:${BRAND.cream};border-top:1px solid ${BRAND.border};">
                <p style="margin:0;color:${BRAND.muted};font-size:12px;line-height:1.6;">
                  ${escapeHtml(siteConfig.legalName)} · ${escapeHtml(siteConfig.contact.address.city)}, ${escapeHtml(siteConfig.contact.address.country)}<br/>
                  Questions? Reply to this email or reach us at ${escapeHtml(siteConfig.contact.email)} / ${escapeHtml(siteConfig.contact.phone)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Order Confirmed — ${orderNumber}`,
    ``,
    `Thank you, ${contactName}. We've received your order and will be in touch to confirm delivery.`,
    ``,
    ...items.map((i) => `${i.product_name}${i.variant_label ? ` (${i.variant_label})` : ""} x${i.quantity} — ${formatPkr(i.line_total)}`),
    ``,
    `Subtotal: ${formatPkr(subtotal)}`,
    `Shipping: ${formatPkr(shippingFee)}`,
    `Total: ${formatPkr(total)}`,
    ``,
    `Payment method: ${paymentLabel}`,
    setPasswordUrl ? `\nSet your password: ${setPasswordUrl}` : "",
    signInUrl ? `\nSign in to view this order: ${signInUrl}` : "",
    ``,
    `${siteConfig.legalName} · ${siteConfig.contact.email} · ${siteConfig.contact.phone}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `Order Confirmed — ${orderNumber}`,
    html,
    text,
  };
}
