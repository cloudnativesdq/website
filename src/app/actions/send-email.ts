
"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Missing fields" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Cloud Native SDQ <onboarding@resend.dev>", // Note: Replace with verified domain in production
      to: ["organizers@cloudnativesdq.org"],
      subject: `Nuevo mensaje de contacto de ${name}`,
      replyTo: email,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Server Action error:", err);
    return { error: err.message || "Failed to send email" };
  }
}
