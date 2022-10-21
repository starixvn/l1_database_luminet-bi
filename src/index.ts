import { BSON, DBHelper, Logger } from '@ldb/db-common';
import { ENV, InstanceConfigs, InstanceName, Instances, InstanceType } from '@ldb/luminet-connection-strings';
import { connectionParams, schemaDBName } from './configs';
import schema from './schema';

try {
  /**  */
  const env: ENV = process.env.ENVIRONMENT as ENV;
  const type: InstanceType = InstanceType.ACTIVE;
  const epoch: number = Date.parse('2022-10-19') / 1000;

  Logger.info(undefined, 'deploy', [env, type, epoch].join(' - '));

  const conns = Instances.getInstanceConnections(env, type);
  Object.entries(conns).forEach(async ([instance, connStr]) => {
    const uri       = DBHelper.buildURI(process.env, undefined, connStr);
    const mongo     = DBHelper.getMongoClient(DBHelper.buildURI(process.env, connectionParams, uri));
    const instanceL = InstanceConfigs[instance as InstanceName].l;
    const biId      = instance + '-BI';

    Logger.info(undefined, 'deploy', [instance, DBHelper.getConnectionStringURI(mongo)].join(': '));
    
    /** Schema Id is an ObjectId with 8 bytes date + 16 bytes name with template L${L}sch-v2 */
    const schemaId  = new BSON.ObjectId(`${epoch.toString(16)}${Buffer.from(`L${instanceL}sch-v2`).toString('hex')}`);

    const schemaDB = mongo.db(schemaDBName);
    const session  = mongo.startSession();

    session.startTransaction();
    try {
      const result = await Promise.all([
        schemaDB.collection('names').updateOne({ _id: biId }, [{ $set: { schema_id: schemaId } }], { upsert: true, writeConcern: { w: 'majority' } }),
        schemaDB.collection('schemas').updateOne({ _id: schemaId }, [{ $set: { schema } }], { upsert: true, writeConcern: { w: 'majority' } }),
      ]);

      session.commitTransaction();
      Logger.info(result, 'deploy', `${biId}`);
    } catch (e) {
      if (e instanceof Error) {
        Logger.catchError(e, 'deploy');
      } else {
        Logger.err(JSON.stringify(e), 'deploy');
      };

      session.abortTransaction();
    } finally {
      session.endSession();
      mongo.close();
    };

    console.log(schemaId);
  });
} catch (e) {
  if (e instanceof Error) Logger.catchError(e, 'main');
  Logger.err(e, 'main');
}

Logger.info(undefined, 'main', 'done');
