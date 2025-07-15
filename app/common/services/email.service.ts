import sgMail from "@sendgrid/mail";
import { loadConfig } from "../helper/config.hepler";

loadConfig();

export enum Transport {
  SENDGRID = "SENDGRID",
}

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendEmail = async (
  mailOptions: {
    to: string | string[];
    from?: string;
    subject: string;
    html: string;
    text?: string;
  },
  transport: Transport = Transport.SENDGRID,
): Promise<any> => {
  try {
    if (transport === Transport.SENDGRID && process.env.SENDGRID_API_KEY) {
      const from = mailOptions.from || process.env.SENDGRID_MAIL_FROM;
      if (!from) throw new Error("SendGrid 'from' address not set");
      return await sgMail.send({ ...mailOptions, from });
    } else {
      throw new Error(`${transport} not initialized`);
    }
  } catch (error: any) {
    console.log(error);
    // throw createHttpError(500, { message: error.message });
  }
};

export const resetPasswordEmailTemplate = (token = ""): string => `
<html>
  <body>
    <h3>Welcome to app</h3>
    <p>Click <a href="${process.env.FE_BASE_URL}/reset-password?token=${token}">here</a> to reset your password</p>
  </body>
</html>`;
