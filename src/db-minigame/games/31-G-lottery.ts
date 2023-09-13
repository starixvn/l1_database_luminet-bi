import { AggregateHelper, BIColumn, BITable, ColumnType } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';
import { columnsBase, pipelineBase } from '../templates/game-base';

const baseName = 'lottery';

/** rounds */
const Rounds = new BITable({
  mongo_name: `${baseName}_phiens`,
  sql_name  : `${baseName}_rounds`,
  pipeline  : [
    { $project: {
      _id: 0,
      ...pipelineBase.gameRound,
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameRound,
  }) as BIColumn[],
});

/** bets */
const Bets = new BITable({
  mongo_name: `${baseName}_ones`,
  sql_name  : `${baseName}_bets`,
  pipeline  : [
    { $match: { playerId: { $gt: 0 } } },
    { $project: {
      _id: 0,
      ...pipelineBase.gameBet,

      betwin      : 1,
      choices     : AggregateHelper.objToJSON('$choices', 2),
      totalAmount : 1,

      stake       : '$totalAmount',
      payout      : '$betwin',
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBet,

    betwin      : Columns.BETWIN,
    choices     : { mongo_name: 'choices', sql_name: 'choices', ...ColumnType.STR    },
    totalAmount : Columns.TOTALAMOUNT,

    stake       : Columns.STAKE,
    payout      : Columns.PAYOUT,
  }) as BIColumn[],
});

/** betlogs */
const BetLogs = new BITable({
  mongo_name: `${baseName}_cuocs`,
  sql_name  : `${baseName}_betlogs`,
  pipeline  : [
    { $match: { playerId: { $gt: 0 } } },
    { $project: {
      _id: 0,
      ...pipelineBase.gameBetLog,
      choices : AggregateHelper.objToJSON('$choices', 2),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBetLog,
    choices : { mongo_name: 'choices', sql_name: 'choices', ...ColumnType.STR    },
  }) as BIColumn[],
});

const lotteryTables = [Rounds, Bets, BetLogs];
export default lotteryTables;
