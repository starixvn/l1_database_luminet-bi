import { BIColumn, BITable } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';
import { columnsBase, pipelineBase } from '../templates/summary-base';

const postfix = 'summaries';
const players = 'players';

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
const DailyPlayers = new BITable({
  mongo_name: `daily_${postfix}`,
  sql_name  : `daily_${players}`,
  pipeline  : [
    ...pipelineBase.betPlayers,
  ],
  columns   : Object.values({
    ...columnsBase.betPlayers,
  }) as BIColumn[],
});

/** hourly */
const Hourly = new BITable({
  mongo_name: `hourly_${postfix}`,
  sql_name  : `hourly_${postfix}`,
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
const HourlyPlayers = new BITable({
  mongo_name: `hourly_${postfix}`,
  sql_name  : `hourly_${players}`,
  pipeline  : [
    ...pipelineBase.betPlayers,
  ],
  columns   : Object.values({
    ...columnsBase.betPlayers,
  }) as BIColumn[],
});

const betSummariesTables = [Round, Daily, DailyPlayers, Hourly, HourlyPlayers];
export default betSummariesTables;
