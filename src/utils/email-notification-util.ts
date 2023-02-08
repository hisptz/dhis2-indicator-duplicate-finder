import { emailConfig } from '../configs';

import nodemailer from 'nodemailer';
import { LogsUtil } from './logs-util';

export class EmailNotificationUtil {
  private _transporter: any;

  constructor() {
    this._transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'login',
        user: emailConfig.senderEmail || '',
        pass: emailConfig.password || ''
      }
    });
  }

  async sendEmail(
    htmlMessage: string,
    fileName: string = '',
    fileDir: string = ''
  ) {
    try {
      await this._transporter.sendMail({
        from: `${emailConfig.senderName} ${emailConfig.senderEmail}`,
        to: emailConfig.receiverEmails.join(', '),
        subject: emailConfig.subject,
        html: htmlMessage,
        attachments:
          fileName !== '' && fileDir !== ''
            ? [
                {
                  filename: fileName,
                  path: `${fileDir}/${fileName}`
                }
              ]
            : []
      });
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'sendEmail'
      );
    }
  }
}
