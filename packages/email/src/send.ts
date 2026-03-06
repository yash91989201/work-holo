import { render } from "@react-email/render";
import type { Transporter } from "nodemailer";
import type { ReactElement } from "react";

export interface SendEmailOptions {
  from?: string;
  react: ReactElement;
  replyTo?: string;
  subject: string;
  to: string | string[];
}

export async function sendEmail(
  transport: Transporter,
  options: SendEmailOptions
): Promise<void> {
  const html = await render(options.react);

  await transport.sendMail({
    from: options.from,
    to: options.to,
    subject: options.subject,
    html,
    replyTo: options.replyTo,
  });
}
