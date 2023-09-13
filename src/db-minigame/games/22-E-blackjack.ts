import { AggregateHelper, BIColumn, BITable, ColumnType } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';
import { columnsBase, pipelineBase } from '../templates/game-base';

const baseName = 'blackjack';

/** rounds */
const Rounds = new BITable({
  mongo_name: `${baseName}_phiens`,
  sql_name  : `${baseName}_rounds`,
  pipeline  : [
    { $project: {
      _id: 0,
      ...pipelineBase.gameRound,

      result           : AggregateHelper.arrToJSON('$result'),
      settlementResult : 1,

      ended            : 1,
      name             : 1,
      odds             : AggregateHelper.objToJSON('$odds'),
      roundStartTime   : 1,
      uid              : 1,
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameRound,

    settlementResult : { mongo_name: 'settlementResult', sql_name: 'settlementResult', ...ColumnType.INT64  },

    ended            : { mongo_name: 'ended'           , sql_name: 'ended'           , ...ColumnType.BOOL   },
    name             : Columns.NAME,
    odds             : Columns.ODDS,
    roundStartTime   : { mongo_name: 'roundStartTime'  , sql_name: 'roundStartTime'  , ...ColumnType.DATE   },
    uid              : Columns.UID,
  }) as BIColumn[],
});

/** bets */
const Bets = new BITable({
  mongo_name: `${baseName}_cuocs`,
  sql_name  : `${baseName}_bets`,
  pipeline  : [
    { $match: { playerId: { $gt: 0 } } },
    { $project: {
      _id: 0,
      ...pipelineBase.gameBet,

      bet        : 1,
      betwin     : 1,

      stake      : '$bet',
      payout     : '$betwin',

      actions    : AggregateHelper.arrToJSON('$actions'),
      cards      : AggregateHelper.arrToJSON('$cards'),
      id         : 1,
      pos        : 1,
      softPoints : AggregateHelper.arrToJSON('$softPoints'),
      splitFrom  : 1,
      total      : 1,
    } },
  ],
  columns   : Object.values({
    ...columnsBase.gameBet,

    bet        : { mongo_name: 'bet'       , sql_name: 'bet'       , ...ColumnType.FLOAT  },
    betwin     : Columns.BETWIN,

    stake      : Columns.STAKE,
    payout     : Columns.PAYOUT,

    actions    : { mongo_name: 'actions'   , sql_name: 'actions'   , ...ColumnType.STR    },
    cards      : { mongo_name: 'cards'     , sql_name: 'cards'     , ...ColumnType.STR    },
    id         : { mongo_name: 'id'        , sql_name: 'id'        , ...ColumnType.INT64  },
    pos        : { mongo_name: 'pos'       , sql_name: 'pos'       , ...ColumnType.INT64  },
    softPoints : { mongo_name: 'softPoints', sql_name: 'softPoints', ...ColumnType.STR    },
    splitFrom  : { mongo_name: 'splitFrom' , sql_name: 'splitFrom' , ...ColumnType.INT64  },
    total      : { mongo_name: 'total'     , sql_name: 'total'     , ...ColumnType.INT64  },
  }) as BIColumn[],
});

const blackjackTables = [Rounds, Bets];
export default blackjackTables;
