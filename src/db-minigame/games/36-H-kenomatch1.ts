import { AggregateHelper, BIColumn, BITable, ColumnType } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';
import { columnsBase, pipelineBase } from '../templates/game-base';

const baseName = 'kenomatch1';
const options  = ['fhBlue', 'fhRed', 'fhOver', 'fhUnder', 'fhOdd', 'fhEven', 'ftBlue', 'ftRed', 'ftOver', 'ftUnder', 'ftOdd', 'ftEven', 'liveFTBlue', 'liveFTRed', 'liveFTOver', 'liveFTUnder', 'liveFTOdd', 'liveFTEven'];

/** rounds */
const Rounds = new BITable({
  mongo_name: `${baseName}_phiens`,
  sql_name  : `${baseName}_rounds`,
  pipeline  : [
    { $project: {
      _id: 0,
      ...pipelineBase.gameRound,
      settled   : 1,
      firstHalf : AggregateHelper.objToJSON('$firstHalf', 3),
      fullTime  : AggregateHelper.objToJSON('$fullTime', 3),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameRound,
    settled   : { mongo_name: 'settled'  , sql_name: 'settled'  , ...ColumnType.BOOL   },
    firstHalf : { mongo_name: 'firstHalf', sql_name: 'firstHalf', ...ColumnType.STR    },
    fullTime  : { mongo_name: 'fullTime' , sql_name: 'fullTime' , ...ColumnType.STR    },
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
      refund      : 1,
      totalAmount : 1,

      stake       : '$totalAmount',
      payout      : '$betwin',

      ...Object.fromEntries(options.map(o => [o, 1])),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBet,

    betwin      : Columns.BETWIN,
    refund      : Columns.REFUND,
    totalAmount : Columns.TOTALAMOUNT,

    stake       : Columns.STAKE,
    payout      : Columns.PAYOUT,

    ...Object.fromEntries(options.map(o => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT  }])),
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

      amount : 1,
      choice : 1,

      ...Object.fromEntries(options.map(o => [o, { $cond: [{ $eq: ['$choice', o] }, '$amount', 0] }])),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBetLog,

    amount : Columns.AMOUNT,
    choice : { mongo_name: 'choice', sql_name: 'choice', ...ColumnType.STR    },

    ...Object.fromEntries(options.map(o => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT  }])),
  }) as BIColumn[],
});

const kenomatch1Tables = [Rounds, Bets, BetLogs];
export default kenomatch1Tables;
