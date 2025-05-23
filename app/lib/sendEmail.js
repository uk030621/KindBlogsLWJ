import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: Array.isArray(to) ? to : to.split(",").map((email) => email.trim()),
      subject,
      html,
    });

    if (response.error) {
      console.error("Resend send error:", response.error);
      throw new Error("Resend failed to send email");
    }

    return response;
  } catch (err) {
    console.error("sendEmail failed:", err);
    throw err;
  }
}
