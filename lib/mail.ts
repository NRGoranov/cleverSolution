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

function singleLine(value: string) {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
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
  const name = singleLine(input.name);
  const email = singleLine(input.email);
  const phone = input.phone ? singleLine(input.phone) : "";
  const product = input.product ? singleLine(input.product) : "";
  const message = input.message.replace(/\u0000/g, "").trim();
  const productLine = product ? `Продукт: ${product}` : "";
  const phoneLine = phone ? `Телефон: ${phone}` : "";
  const text = [
    `Име: ${name}`,
    `Имейл: ${email}`,
    phoneLine,
    productLine,
    "",
    "Съобщение:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const transporter = getTransporter();
  const subject = singleLine(
    `Ново запитване от ${name}${product ? ` — ${product}` : ""}`
  ).slice(0, 180);

  await transporter.sendMail({
    from: user,
    to,
    replyTo: email,
    subject,
    text,
  });

  try {
    await transporter.sendMail({
      from: user,
      to: email,
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
