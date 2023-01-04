import { BIColumn, BITable, ColumnType } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';
import { columnsBase, pipelineBase } from '../templates/game-base';

const baseName = 'sicbo';
const options  = ['single', 'double', 'triple', 'big', 'small', 'anyTriple', 'total4', 'total5', 'total6', 'total7', 'total8', 'total9', 'total10', 'total11', 'total12', 'total13', 'total14', 'total15', 'total16', 'total17'];

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

      betwin : 1,

      stake  : { $multiply: [{ $add: options.map(o => `$${o}`) }, { $toInt: { $not: '$freeBet' } }] },
      payout : '$betwin',

      ...Object.fromEntries(options.map(o => [o, 1])),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBet,

    betwin : Columns.BETWIN,

    stake  : Columns.STAKE,
    payout : Columns.PAYOUT,

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

      stake  : { $multiply: [{ $add: options.map(o => `$${o}`) }, { $toInt: { $not: '$freeBet' } }] },
      payout : '$betwin',

      ...Object.fromEntries(options.map(o => [o, { $cond: [{ $eq: ['$choice', o] }, '$amount', 0] }])),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBetLog,

    amount : Columns.AMOUNT,
    choice : { mongo_name: 'choice', sql_name: 'choice', ...ColumnType.STR    },

    stake  : Columns.STAKE,
    payout : Columns.PAYOUT,

    ...Object.fromEntries(options.map(o => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT  }])),
  }) as BIColumn[],
});

const sicboTables = [Rounds, Bets, BetLogs];
export default sicboTables;
