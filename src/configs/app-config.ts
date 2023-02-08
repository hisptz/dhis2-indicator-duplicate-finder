import { AppConfigModel, EmailConfigModel } from '../models';

export const appConfig: AppConfigModel = {
  username: 'scriptrunner',
  password: 'Script@123',
  baseUrl: 'https://lsis-ovc-dreams.org'
};

export const emailConfig: EmailConfigModel = {
  subject: 'DHIS2 POSSIBLE INDICATOR DUPLICATES',
  senderName: 'Joseph Chingalo',
  senderEmail: 'profschingalo@gmail.com',
  password: 'ylxzqfopnwkrciwv',
  receiverEmails: ['jchingalo@hisptanzania.org']
};
