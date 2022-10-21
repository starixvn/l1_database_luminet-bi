import { BIColumn, BITable } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';
import { columnsBase, pipelineBase } from '../templates/summary-base';

const postfix = 'summaries';

/** round */
const Round = new BITable({
  mongo_name: `round_${postfix}`,
  sql_name  : `round_${postfix}`,
  pipeline  : [
    { $project: {
      _id: 0,
      ...pipelineBase.betSummary,
      roundId : 1,
    } },
  ],
  columns   : Object.values({
    ...columnsBase.betSummary,
    roundId : Columns.ROUNDID,
  }) as BIColumn[],
});


/** daily */
const Daily = new BITable({
  mongo_name: `daily_${postfix}`,
  sql_name  : `daily_${postfix}`,
  pipeline  : [
    { $project: {
      _id: 0,
      ...pipelineBase.betSummary,
    } },
  ],
  columns   : Object.values({
    ...columnsBase.betSummary,
  }) as BIColumn[],
});

/** hourly */
const Hourly = new BITable({
  mongo_name: `daily_${postfix}`,
  sql_name  : `daily_${postfix}`,
  pipeline  : [
    { $project: {
      _id: 0,
      ...pipelineBase.betSummary,
    } },
  ],
  columns   : Object.values({
    ...columnsBase.betSummary,
  }) as BIColumn[],
});

const betSummariesTables = [Round, Daily, Hourly];
export default betSummariesTables;
