import { getResendClient, EMAIL_FROM } from "@/lib/email/resend";
import { buildOrderConfirmationEmail, type OrderConfirmationEmailInput } from "@/lib/email/templates/order-confirmation";

/**
 * Best-effort: a failed or skipped (no RESEND_API_KEY) send never fails order
 * placement — the order is already written by the time this runs.
 */
export async function sendOrderConfirmationEmail(to: string, input: OrderConfirmationEmailInput) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping order confirmation email to", to);
    return;
  }

  const { subject, html, text } = buildOrderConfirmationEmail(input);

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("[email] Failed to send order confirmation to", to, error);
  }
}
