import { NextResponse } from "next/server";
import { createResetToken, findAdminSlot } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const slot = findAdminSlot(email);

    if (slot) {
      const token = await createResetToken(email);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const resetLink = `${siteUrl}/admin/reset-password?token=${token}`;

      await resend.emails.send({
        from: "Clo Chaperon <noreply@clochaperon.com>",
        to: email,
        subject: "Reset your password",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="font-size: 18px; font-weight: 600; color: #222; margin-bottom: 16px;">
              Reset your password
            </h2>
            <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 24px;">
              We received a request to reset your admin password. Click the button below to choose a new password. This link expires in 15 minutes.
            </p>
            <a href="${resetLink}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px; border-radius: 4px;">
              Reset Password
            </a>
            <p style="font-size: 12px; color: #999; margin-top: 32px; line-height: 1.5;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    }

    // Always return 200 to avoid leaking whether email exists
    return NextResponse.json({
      message: "If that email is registered, you'll receive a reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
