import { BISchema } from '@ldb/mongobi-helper';
import logDB      from './db-log';
import memberDB   from './db-member';
import minigameDB from './db-minigame';
import summaryDB  from './db-summary';

export const schema = new BISchema({ databases: [logDB, memberDB, minigameDB, summaryDB] });

export default schema;
