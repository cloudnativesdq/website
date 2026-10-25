"use server";

import { Resend } from "resend";

export type SendEmailResult = { success: true } | { error: "invalid" | "unavailable" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 3000;

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  // Browsers send textarea line breaks as CRLF; count them as one character like maxLength does.
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim() : "";
}

export async function sendEmail(formData: FormData): Promise<SendEmailResult> {
  // ponytail: honeypot + fill time stop naive bots only (t is client-supplied and forgeable);
  // the Vercel Firewall rate limit covers scripted ones. Add Turnstile if spam still gets through.
  // t is milliseconds since the form rendered, measured on the client so clock skew does not matter.
  const elapsed = Number(field(formData, "t"));
  if (field(formData, "hp") || !(elapsed >= MIN_FILL_MS)) {
    return { success: true };
  }

  const name = field(formData, "name").replace(/[\r\n]+/g, " ");
  const email = field(formData, "email");
  const message = field(formData, "message");

  if (
    name.length < 1 || name.length > 100 ||
    email.length > 254 || !EMAIL_RE.test(email) ||
    message.length < 10 || message.length > 5000
  ) {
    return { error: "invalid" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not defined in environment variables");
    return { error: "unavailable" };
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: "Cloud Native Santo Domingo <notificaciones@cloudnativesdq.org>",
      to: ["organizers@cloudnativesdq.org"],
      subject: `Nuevo mensaje de contacto de ${name}`,
      replyTo: email,
      text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error: "unavailable" };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Server Action error:", err);
    return { error: "unavailable" };
  }
}
