import { ColumnType } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';

export const pipelineBase = {
  betSummary: {
    time       : 1,
    currency   : 1,
    gameId     : 1,
    isCash     : 1,
    maxWinloss : 1,
    minWinloss : 1,
    operatorId : 1,
    payout     : 1,
    players    : 1,
    refund     : 1,
    stake      : 1,
    tickets    : 1,
    winloss    : 1,
    archived   : { $ifNull: [{ $toBool: '$__archive.eventtime' }, false] },
  },
  betPlayers: [
    { $project: { _id: 0, time: 1, gameId: 1, currency: 1, isCash: 1, operatorId: 1, playerIds: 1 } },
    { $unwind: '$playerIds' },
  ],
};

export const columnsBase = {
  betSummary: {
    time       : Columns.TIME,
    currency   : Columns.CURRENCY,
    gameId     : Columns.GAMEID,
    isCash     : Columns.ISCASH,
    maxWinloss : { mongo_name: 'maxWinloss', sql_name: 'maxWinloss', ...ColumnType.FLOAT  },
    minWinloss : { mongo_name: 'minWinloss', sql_name: 'minWinloss', ...ColumnType.FLOAT  },
    operatorId : Columns.OPERATORID,
    payout     : Columns.PAYOUT,
    players    : { mongo_name: 'players'   , sql_name: 'players'   , ...ColumnType.INT64  },
    refund     : Columns.REFUND,
    stake      : Columns.STAKE,
    tickets    : { mongo_name: 'tickets'   , sql_name: 'tickets'   , ...ColumnType.INT64  },
    winloss    : { mongo_name: 'winloss'   , sql_name: 'winloss'   , ...ColumnType.FLOAT  },
    archived   : Columns.ARCHIVED,
    _fitter    : Columns.FILTER,
  },
  betPlayers: {
    time       : Columns.TIME,
    gameId     : Columns.GAMEID,
    currency   : Columns.CURRENCY,
    isCash     : Columns.ISCASH,
    operatorId : Columns.OPERATORID,
    playerId   : { mongo_name: 'playerIds', sql_name: 'playerId', ...ColumnType.INT64  },
  },
};
