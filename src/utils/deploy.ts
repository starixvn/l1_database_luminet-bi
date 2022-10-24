import { BSON, DBHelper, Logger, MongoClient } from '@ldb/db-common';
import { ENV, InstanceConfigs, InstanceName, InstanceType, Instances, L } from '@ldb/luminet-connection-strings';
import { BISchema } from '@ldb/mongobi-helper';
import { connectionParams } from '../configs';

const epoch: number = Date.parse('2022-10-19') / 1000;
const schemaConfig = {
  database : 'schema',
  idColl   : 'names',
  defColl  : 'schemas',
};

/**
 * @param schema 
 * @param instance 
 * @param mongo 
 */
export async function deploySchemaToInstance(schema: BISchema, instance: InstanceName, mongo: MongoClient) {
  const label    = `Deploy ${instance}`;
  const config   = InstanceConfigs[instance];
  const biId     = `${instance}-BI`;
  const schemaId = new BSON.ObjectId(`${epoch.toString(16)}${Buffer.from(`L${config.l}sch-v2`).toString('hex')}`);
  const subject  = `${biId}: ${schemaId}`;

  Logger.trace(DBHelper.redactMongoConnectionString(mongo), label, `Starting BI schema deployment for ${instance}...`);
  Logger.trace(undefined, label, subject);

  const schemaDB = mongo.db(schemaConfig.database);

  /** Start deployment session */
  const session = mongo.startSession();

  try {
    /** We want to ensure all of changes are atomic */
    session.startTransaction();

    /** Need all promises are resolved, using Promise.all */
    const result = await Promise.all([
      schemaDB.collection(schemaConfig.idColl ).updateOne({ _id: biId }, [{ $set: { schema_id: schemaId } }], { upsert: true, writeConcern: { w: 'majority' } }),
      schemaDB.collection(schemaConfig.defColl).updateOne({ _id: schemaId }, [{ $set: { schema } }], { upsert: true, writeConcern: { w: 'majority' } }),
    ]);

    /** Commit the changes */
    session.commitTransaction();
    Logger.info(result.map((res) => JSON.stringify(res)).join('\n'), label, subject);
  } catch (e) {
    /** If an error occur, log it */
    if (e instanceof Error) {
      Logger.catchError(e, label);
    } else {
      Logger.err(JSON.stringify(e), label, subject);
    }

    /** Revert all changes */
    session.abortTransaction();
  } finally {
    /** Close connection */
    session.endSession();
    mongo.close();
  };
}

export async function deploySchema(schema: BISchema, env?: ENV, type?: InstanceType, l?: L, i?: number) {
  const label = 'Deploy Main';

  try {
    /** Get all instances to be deployed */
    const instances = Instances.getInstanceConnections(env, type, l, i);

    /** Some instances can failed */
    const result = await Promise.allSettled(Object.entries(instances).map(async ([instance, connection]) => {
      /** Get mongo connection */
      const mongo = DBHelper.getMongoClient(DBHelper.buildURI(process.env, connectionParams, connection));

      return deploySchemaToInstance(schema, instance as InstanceName, mongo);
    }));

    /** result may contains errors, check for them */
    result.forEach((item) => {
      if (item.status === 'rejected') {
        Logger.err(item.reason, label);
      }
    });
  } catch (e) {
    /** If an error occur, log it */
    if (e instanceof Error) {
      Logger.catchError(e, label);
    } else {
      Logger.err(JSON.stringify(e), label);
    }
  }
};

const Deploy = Object.freeze({ deploySchema, deploySchemaToInstance });
export default Deploy;
