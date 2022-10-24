import { Logger } from '@ldb/db-common';
import { ENV, InstanceType } from '@ldb/luminet-connection-strings';
import schema from './schema';
import { deploySchema } from './utils/deploy';

try {
  /**  */
  const env: ENV = process.env.ENVIRONMENT as ENV;
  const type: InstanceType = InstanceType.ACTIVE;

  deploySchema(schema, env, type);
} catch (e) {
  if (e instanceof Error) Logger.catchError(e, 'main');
  Logger.err(e, 'main');
}
