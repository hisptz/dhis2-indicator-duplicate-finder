import { AppConfigModel, EmailConfigModel } from '../models';

export const appConfig: AppConfigModel = {
  username: 'chingalo',
  password: 'Joseph@111987',
  baseUrl: 'https://dhis.moh.go.tz'
};

export const emailConfig: EmailConfigModel = {
  subject: 'DHIS2 POSSIBLE INDICATOR DUPLICATES',
  senderName: 'Joseph Chingalo',
  senderEmail: 'profschingalo@gmail.com',
  password: 'ylxzqfopnwkrciwv',
  receiverEmails: ['jchingalo@hisptanzania.org']
};
