import { z } from "zod";
import { NextResponse } from "next/server";
import { bg } from "@/content/bg";
import { isSmtpConfigured, sendContactEmail } from "@/lib/mail";

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
