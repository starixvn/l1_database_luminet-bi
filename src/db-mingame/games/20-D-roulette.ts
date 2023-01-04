import { BIColumn, BITable, ColumnType } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';
import { columnsBase, pipelineBase } from '../templates/game-base';

const baseName = 'roulette';
const options  = ['straightUp', 'split', 'street', 'triangle', 'corner', 'fourNumbers', 'line', 'column', 'dozen', 'redBlack', 'oddEven', 'bigSmall'];

/** rounds */
const Rounds = new BITable({
  mongo_name: `${baseName}_phiens`,
  sql_name  : `${baseName}_rounds`,
  pipeline  : [
    { $project: {
      _id: 0,
      ...pipelineBase.gameRound,
      result : 1,
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameRound,
    result : { mongo_name: 'result', sql_name: 'result', ...ColumnType.INT64  },
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
      totalAmount : 1,

      stake       : '$totalAmount',
      payout      : '$betwin',

      ...Object.fromEntries(options.map(o => [o, { $ifNull: [{ $reduce: { input: { $objectToArray: o }, initialValue: 0, in: { $add: ['$$value', '$$this.v'] } } }, 0] }])),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBet,

    betwin      : Columns.BETWIN,
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

      ...Object.fromEntries(options.map(o => [o, { $ifNull: [{ $reduce: { input: { $objectToArray: o }, initialValue: 0, in: { $add: ['$$value', '$$this.v'] } } }, 0] }])),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBetLog,

    ...Object.fromEntries(options.map(o => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT  }])),
  }) as BIColumn[],
});

const rouletteTables = [Rounds, Bets, BetLogs];
export default rouletteTables;
