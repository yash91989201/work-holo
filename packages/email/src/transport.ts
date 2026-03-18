import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

export interface SmtpConfig {
  auth: {
    user: string;
    pass: string;
  };
  host: string;
  port: number;
  secure?: boolean;
}

export function createEmailTransport(config: SmtpConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure ?? config.port === 465,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
  });
}
