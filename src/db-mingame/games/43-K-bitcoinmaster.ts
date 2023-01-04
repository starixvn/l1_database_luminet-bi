import { AggregateHelper, BIColumn, BITable, ColumnType } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';
import { columnsBase, pipelineBase } from '../templates/game-base';

const baseName = 'bitcoinmaster';
const options  = ['up', 'down', 'odd', 'even'];

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
  mongo_name: `${baseName}_bets`,
  sql_name  : `${baseName}_bets`,
  pipeline  : [
    { $match: { playerId: { $gt: 0 } } },
    { $project: {
      _id: 0,
      ...pipelineBase.gameBet,

      baseBetWin      : 1,
      baseRefund      : 1,
      baseTotalAmount : 1,
      baseTotalWin    : 1,
      betwin          : 1,
      odds            : AggregateHelper.objToJSON('$odds', 2),
      refund          : 1,
      totalAmount     : 1,
      totalWin        : 1,

      stake           : '$baseTotalAmount',
      payout          : '$baseTotalWin',

      ...Object.fromEntries(options.map(o => [o, 1])),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBet,

    baseBetWin      : Columns.BASEBETWIN,
    baseRefund      : Columns.BASEREFUND,
    baseTotalAmount : Columns.BASETOTALAMOUNT,
    baseTotalWin    : Columns.BASETOTALWIN,
    betwin          : Columns.BETWIN,
    odds            : Columns.ODDS,
    refund          : Columns.REFUND,
    totalAmount     : Columns.TOTALAMOUNT,
    totalWin        : Columns.TOTALWIN,

    stake           : Columns.STAKE,
    payout          : Columns.PAYOUT,

    ...Object.fromEntries(options.map(o => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT  }])),
  }) as BIColumn[],
});

/** betlogs */
const BetLogs = new BITable({
  mongo_name: `${baseName}_betlogs`,
  sql_name  : `${baseName}_betlogs`,
  pipeline  : [
    { $match: { playerId: { $gt: 0 } } },
    { $project: {
      _id: 0,
      ...pipelineBase.gameBetLog,

      amount     : 1,
      baseAmount : 1,
      baseBetWin : 1,
      baseRefund : 1,
      betwin     : 1,
      choice     : 1,
      refund     : 1,
      win        : 1,

      stake      : '$baseAmount',
      payout     : '$baseBetWin',

      ...Object.fromEntries(options.map(o => [o, { $cond: [{ $eq: ['$choice', o] }, '$amount', 0] }])),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBetLog,

    amount     : Columns.AMOUNT,
    baseAmount : Columns.BASEAMOUNT,
    baseBetWin : Columns.BASEBETWIN,
    baseRefund : Columns.BASEREFUND,
    betwin     : Columns.BETWIN,
    choice     : { mongo_name: 'choice', sql_name: 'choice', ...ColumnType.STR    },
    refund     : Columns.REFUND,
    win        : { mongo_name: 'win'   , sql_name: 'win'   , ...ColumnType.BOOL   },

    stake      : Columns.STAKE,
    payout     : Columns.PAYOUT,

    ...Object.fromEntries(options.map(o => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT  }])),
  }) as BIColumn[],
});

const bitcoinmasterTables = [Rounds, Bets, BetLogs];
export default bitcoinmasterTables;
