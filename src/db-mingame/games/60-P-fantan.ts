import { BIColumn, BITable, ColumnType } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';
import { columnsBase, pipelineBase } from '../templates/game-base';

const baseName = 'fantan';
const options  = ['even', 'odd', 'fan1', 'fan2', 'fan3', 'fan4', 'kwok12', 'kwok23', 'kwok34', 'kwok41', 'chun123', 'chun124', 'chun134', 'chun234'];

/** rounds */
const Rounds = new BITable({
  mongo_name: `${baseName}_rounds`,
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

      betwin      : 1,
      totalAmount : 1,

      stake       : '$totalAmount',
      payout      : '$betwin',

      ...Object.fromEntries(options.map(o => [o, 1])),
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

const fantanTables = [Rounds, Bets];
export default fantanTables;
