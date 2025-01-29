import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const { firstName, lastName, email, subject, message } = data;

        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: import.meta.env.SMTP_HOST,
            port: parseInt(import.meta.env.SMTP_PORT),
            secure: true,
            auth: {
                user: import.meta.env.SMTP_USER,
                pass: import.meta.env.SMTP_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: import.meta.env.SMTP_USER,
            to: import.meta.env.CONTACT_EMAIL_TO,
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
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({
            message: 'Email sent successfully'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({
            message: 'Failed to send email'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 