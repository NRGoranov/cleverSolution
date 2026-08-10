import { z } from "zod";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { bg } from "@/content/bg";
import { siteConfig } from "@/lib/site-config";

const ContactSchema = z.object({
  name: z.string().min(2, "Името е задължително"),
  email: z.string().email("Невалиден имейл адрес"),
  phone: z.string().optional(),
  product: z.string().optional(),
  message: z.string().min(10, "Съобщението е твърде кратко"),
});

export async function POST(request: Request) {
  try {
    const parsed = ContactSchema.safeParse(await request.json());

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, phone, product, message } = parsed.data;

    // E2E tests: CONTACT_TEST_MODE=1 skips Resend and returns success.
    if (process.env.CONTACT_TEST_MODE === "1") {
      return NextResponse.json({ success: true, testMode: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: bg.contact.form.error },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const productLine = product ? `\nПродукт: ${product}` : "";
    const phoneLine = phone ? `\nТелефон: ${phone}` : "";

    const { error } = await resend.emails.send({
      from: siteConfig.contact.fromEmail,
      to: siteConfig.contact.toEmail,
      replyTo: email,
      subject: `Ново запитване от ${name}${product ? ` — ${product}` : ""}`,
      text: [
        `Име: ${name}`,
        `Имейл: ${email}`,
        phoneLine,
        productLine,
        "",
        "Съобщение:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: bg.contact.form.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: bg.contact.form.error },
      { status: 500 }
    );
  }
}
