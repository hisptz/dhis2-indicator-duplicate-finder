import { AppConfigModel, EmailConfigModel } from '../models';

export const appConfig: AppConfigModel = {
  username: 'dhis_username',
  password: 'dhis_password',
  baseUrl: 'dhis_base_url'
};

export const emailConfig: EmailConfigModel = {
  subject: 'subject_on_the_emeail',
  senderName: 'name_of_sender',
  senderEmail: 'gamil_account',
  password: 'passsword',
  receiverEmails: ['list of emails to recieve emails']
};
