import _ from 'lodash';
import { LogsUtil } from '../utils';

export class AppProcess {
  constructor() {}

  async startProcess() {
    try {
      // TODO logics for data
      console.log('Todo handle logics for the script');
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'startProcess'
      );
    }
  }
}
