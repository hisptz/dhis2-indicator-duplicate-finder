export interface EmailConfigModel {
  subject: string;
  senderName: string;
  senderEmail: string;
  password: string;
  receiverEmails: string[];
}
