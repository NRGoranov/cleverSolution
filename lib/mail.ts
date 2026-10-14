import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site-config";

function smtpUser() {
  return process.env.SMTP_USER ?? process.env.EMAIL_USER ?? "";
}

function smtpPass() {
  return process.env.SMTP_PASS ?? process.env.EMAIL_PASSWORD ?? "";
}

export function isSmtpConfigured() {
  return Boolean(smtpUser() && smtpPass());
}

function getTransporter() {
  const user = smtpUser();
  const pass = smtpPass();
  const host = process.env.SMTP_HOST;

  if (host) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function getToEmails() {
  const raw =
    process.env.TO_EMAIL ??
    process.env.CONTACT_TO_EMAIL ??
    siteConfig.contact.toEmail;
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  phone?: string;
  product?: string;
  message: string;
}) {
  const user = smtpUser();
  const to = getToEmails();
  const productLine = input.product ? `Продукт: ${input.product}` : "";
  const phoneLine = input.phone ? `Телефон: ${input.phone}` : "";
  const text = [
    `Име: ${input.name}`,
    `Имейл: ${input.email}`,
    phoneLine,
    productLine,
    "",
    "Съобщение:",
    input.message,
  ]
    .filter(Boolean)
    .join("\n");

  const transporter = getTransporter();
  const subject = `Ново запитване от ${input.name}${
    input.product ? ` — ${input.product}` : ""
  }`;

  await transporter.sendMail({
    from: user,
    to,
    replyTo: input.email,
    subject,
    text,
  });

  try {
    await transporter.sendMail({
      from: user,
      to: input.email,
      subject: "Копие на вашето запитване — Clever Solution",
      text: [
        "Благодарим ви за запитването. Получихме следното съобщение:",
        "",
        text,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Contact copy-to-sender failed:", error);
  }
}
