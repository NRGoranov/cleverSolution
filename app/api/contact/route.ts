import { z } from "zod";
import { NextResponse } from "next/server";
import { bg } from "@/content/bg";
import { allowContactAttempt, clientIp } from "@/lib/contact-rate";
import { isSmtpConfigured, sendContactEmail } from "@/lib/mail";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Името е задължително").max(120),
  email: z.string().trim().email("Невалиден имейл адрес").max(254),
  phone: z.string().trim().max(40).optional(),
  product: z.string().trim().max(4000).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Съобщението е твърде кратко")
    .max(5000),
});

export async function POST(request: Request) {
  try {
    if (
      process.env.CONTACT_TEST_MODE !== "1" &&
      !allowContactAttempt(clientIp(request))
    ) {
      return NextResponse.json(
        { error: bg.contact.form.rateLimited },
        { status: 429 }
      );
    }

    const parsed = ContactSchema.safeParse(await request.json());

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, phone, product, message } = parsed.data;

    // E2E tests: CONTACT_TEST_MODE=1 skips SMTP and returns success.
    if (process.env.CONTACT_TEST_MODE === "1") {
      return NextResponse.json({ success: true, testMode: true });
    }

    if (!isSmtpConfigured()) {
      console.error("SMTP credentials are not configured");
      return NextResponse.json(
        { error: bg.contact.form.error },
        { status: 500 }
      );
    }

    await sendContactEmail({ name, email, phone, product, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: bg.contact.form.error },
      { status: 500 }
    );
  }
}
