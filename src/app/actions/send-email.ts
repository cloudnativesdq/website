
"use server";

import { Resend } from "resend";

export async function sendEmail(formData: FormData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not defined in environment variables");
    return { error: "Server configuration error: Missing API Key" };
  }

  const resend = new Resend(apiKey);
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Missing fields" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Cloud Native SDQ <notificaciones@cloudnativesdq.org>",
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
