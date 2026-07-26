import {
  CONTACT_EMAIL_TO,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER,
} from "astro:env/server";
import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL_TO) {
      return new Response(JSON.stringify({ message: "Email is not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    const { firstName, lastName, email, subject, message } = data;
    const senderName = `${firstName} ${lastName}`.replace(/[\r\n"<>]/g, "").trim();

    const port = SMTP_PORT ?? 465;
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      // 465 = implicit TLS; 587 = STARTTLS (secure must be false)
      secure: port === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${senderName}" <noreply@mail.spwnd.dev>`,
      replyTo: email,
      to: CONTACT_EMAIL_TO,
      subject: `Contact Form: ${subject}`,
      text: `
                Name: ${firstName} ${lastName}
                Email: ${email}
                Subject: ${subject}
                Message: ${message}
            `,
      html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
    });

    return new Response(JSON.stringify({ message: "Email sent successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ message: "Failed to send email" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
