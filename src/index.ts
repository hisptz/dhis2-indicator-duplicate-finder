import { LogsUtil } from './utils';
import { AppProcess } from './app';
import _ from 'lodash';

startAppProcess();

async function startAppProcess() {
  try {
    await new LogsUtil().clearLogs();
    await new LogsUtil().addLogs(
      'info',
      'Start of Device tracking reports',
      'App'
    );
    const appProcess = new AppProcess();
    await appProcess.startProcess();
    await new LogsUtil().addLogs(
      'info',
      'End of Device tracking reports',
      'App'
    );
  } catch (error: any) {
    await new LogsUtil().addLogs('error', error.toString(), 'App');
  }
}
