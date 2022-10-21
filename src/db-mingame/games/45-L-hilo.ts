import { AggregateHelper, BIColumn, BITable, ColumnType } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';
import { columnsBase, pipelineBase } from '../templates/game-base';

const baseName = 'hilo';
const options  = ['h', 'l'];

/** rounds */
const Rounds = new BITable({
  mongo_name: `${baseName}_rounds`,
  sql_name  : `${baseName}_rounds`,
  pipeline  : [
    { $project: {
      _id: 0,
      ...pipelineBase.gameRound,
      endTime          : 1,
      totalTurns       : 1,
      result           : AggregateHelper.arrToJSON('$result', 2),
      settlementResult : AggregateHelper.arrToJSON('$settlementResult', 2),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameRound,
    endTime          : { mongo_name: 'endTime'   , sql_name: 'endTime'   , ...ColumnType.DATE   },
    totalTurns       : { mongo_name: 'totalTurns', sql_name: 'totalTurns', ...ColumnType.INT64  },
  }) as BIColumn[],
});

/** bets */
const Bets = new BITable({
  mongo_name: `${baseName}_rounds`,
  sql_name  : `${baseName}_bets`,
  pipeline  : [
    { $match: { playerId: { $gt: 0 } } },
    { $project: {
      _id: 0,
      ...pipelineBase.gameBet,

      amount  : 1,
      betwin  : 1,
      id      : 1,
      odds    : AggregateHelper.objToJSON('$odds', 2),

      stake   : '$amount',
      payout  : '$betwin',
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBet,

    amount  : Columns.AMOUNT,
    betwin  : Columns.BETWIN,
    roundId : { mongo_name: 'id', sql_name: 'roundId', ...ColumnType.INT64  },
    odds    : Columns.ODDS,

    stake   : Columns.STAKE,
    payout  : Columns.PAYOUT,
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

      amount : 1,
      betwin : 1,
      cards  : AggregateHelper.arrToJSON('$cards', 2),
      choice : 1,
      order  : 1,

      stake  : '$amount',
      payout : '$betwin',

      ...Object.fromEntries(options.map(o => [o, { $cond: [{ $eq: ['$choice', o] }, '$amount', 0] }])),
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBetLog,

    amount : Columns.AMOUNT,
    betwin : Columns.BETWIN,
    cards  : { mongo_name: 'cards' , sql_name: 'cards' , ...ColumnType.STR    },
    choice : { mongo_name: 'choice', sql_name: 'choice', ...ColumnType.STR    },
    order  : { mongo_name: 'order' , sql_name: 'order' , ...ColumnType.INT64  },

    stake  : Columns.STAKE,
    payout : Columns.PAYOUT,

    ...Object.fromEntries(options.map(o => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT  }])),
  }) as BIColumn[],
});

const hiloTables = [Rounds, Bets, BetLogs];
export default hiloTables;
