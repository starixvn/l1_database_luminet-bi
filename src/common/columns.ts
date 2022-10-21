import { BIColumn, ColumnType } from '@ldb/mongobi-helper';

export const Columns = {
  _ID              : { mongo_name: '_id'              , sql_name: '_id'              , ...ColumnType.OID    } as BIColumn,
  ARCHIVED         : { mongo_name: 'archived'         , sql_name: 'archived'         , ...ColumnType.BOOL   } as BIColumn,
  CURRENCY         : { mongo_name: 'currency'         , sql_name: 'currency'         , ...ColumnType.STR    } as BIColumn,
  ENABLED          : { mongo_name: 'enabled'          , sql_name: 'enabled'          , ...ColumnType.BOOL   } as BIColumn,
  EXCHANGERATEID   : { mongo_name: 'exchangeRateId'   , sql_name: 'exchangeRateId'   , ...ColumnType.INT64  } as BIColumn,
  FILTER           : { mongo_name: '_MONGOFILTER'     , sql_name: '_MONGOFILTER'     , ...ColumnType.FITLER } as BIColumn,
  FREEBET          : { mongo_name: 'freeBet'          , sql_name: 'freeBet'          , ...ColumnType.BOOL   } as BIColumn,
  FREESPIN         : { mongo_name: 'freeSpin'         , sql_name: 'freeSpin'         , ...ColumnType.BOOL   } as BIColumn,
  GAMEID           : { mongo_name: 'gameId'           , sql_name: 'gameId'           , ...ColumnType.INT64  } as BIColumn,
  ID               : { mongo_name: 'id'               , sql_name: 'id'               , ...ColumnType.INT64  } as BIColumn,
  ISCASH           : { mongo_name: 'isCash'           , sql_name: 'isCash'           , ...ColumnType.BOOL   } as BIColumn,
  NAME             : { mongo_name: 'name'             , sql_name: 'name'             , ...ColumnType.STR    } as BIColumn,
  OPERATORID       : { mongo_name: 'operatorId'       , sql_name: 'operatorId'       , ...ColumnType.STR    } as BIColumn,
  PAID             : { mongo_name: 'paid'             , sql_name: 'paid'             , ...ColumnType.BOOL   } as BIColumn,
  PLAYERID         : { mongo_name: 'playerId'         , sql_name: 'playerId'         , ...ColumnType.INT64  } as BIColumn,
  ROUNDID          : { mongo_name: 'roundId'          , sql_name: 'roundId'          , ...ColumnType.INT64  } as BIColumn,
  SITEID           : { mongo_name: 'siteId'           , sql_name: 'siteId'           , ...ColumnType.STR    } as BIColumn,
  RATE             : { mongo_name: 'rate'             , sql_name: 'rate'             , ...ColumnType.FLOAT  } as BIColumn,
  SUMMARIZED       : { mongo_name: 'summarized'       , sql_name: 'summarized'       , ...ColumnType.BOOL   } as BIColumn,
  TIME             : { mongo_name: 'time'             , sql_name: 'time'             , ...ColumnType.DATE   } as BIColumn,
  UID              : { mongo_name: 'uid'              , sql_name: 'uid'              , ...ColumnType.STR    } as BIColumn,
  
  AMOUNT           : { mongo_name: 'amount'           , sql_name: 'amount'           , ...ColumnType.FLOAT  } as BIColumn,
  BASEAMOUNT       : { mongo_name: 'baseAmount'       , sql_name: 'baseAmount'       , ...ColumnType.FLOAT  } as BIColumn,
  BASEBETWIN       : { mongo_name: 'baseBetWin'       , sql_name: 'baseBetWin'       , ...ColumnType.FLOAT  } as BIColumn,
  BASEREFUND       : { mongo_name: 'baseRefund'       , sql_name: 'baseRefund'       , ...ColumnType.FLOAT  } as BIColumn,
  BASETOTALAMOUNT  : { mongo_name: 'baseTotalAmount'  , sql_name: 'baseTotalAmount'  , ...ColumnType.FLOAT  } as BIColumn,
  BASETOTALWIN     : { mongo_name: 'baseTotalWin'     , sql_name: 'baseTotalWin'     , ...ColumnType.FLOAT  } as BIColumn,
  BET              : { mongo_name: 'bet'              , sql_name: 'bet'              , ...ColumnType.FLOAT  } as BIColumn,
  BETWIN           : { mongo_name: 'betwin'           , sql_name: 'betwin'           , ...ColumnType.FLOAT  } as BIColumn,
  TOTALAMOUNT      : { mongo_name: 'totalAmount'      , sql_name: 'totalAmount'      , ...ColumnType.FLOAT  } as BIColumn,
  TOTALWIN         : { mongo_name: 'totalWin'         , sql_name: 'totalWin'           , ...ColumnType.FLOAT  } as BIColumn,
  REFUND           : { mongo_name: 'refund'           , sql_name: 'refund'           , ...ColumnType.FLOAT  } as BIColumn,

  STAKE            : { mongo_name: 'stake'            , sql_name: 'stake'            , ...ColumnType.FLOAT  } as BIColumn,
  PAYOUT           : { mongo_name: 'payout'           , sql_name: 'payout'           , ...ColumnType.FLOAT  } as BIColumn,

  ODDS             : { mongo_name: 'odds'             , sql_name: 'odds'             , ...ColumnType.STR    } as BIColumn,
  PAYLINES         : { mongo_name: 'paylines'         , sql_name: 'paylines'         , ...ColumnType.STR    } as BIColumn,
  RESULT           : { mongo_name: 'result'           , sql_name: 'result'           , ...ColumnType.STR    } as BIColumn,
  SETTLEMENTRESULT : { mongo_name: 'settlementResult' , sql_name: 'settlementResult' , ...ColumnType.STR    } as BIColumn,

  LOGTS            : { mongo_name: 'logTimeStamp'     , sql_name: 'logTimeStamp'     , ...ColumnType.STR    } as BIColumn,
  REQTS            : { mongo_name: 'requestTimeStamp' , sql_name: 'requestTimeStamp' , ...ColumnType.STR    } as BIColumn,
  RESTS            : { mongo_name: 'responseTimeStamp', sql_name: 'responseTimeStamp', ...ColumnType.STR    } as BIColumn,
};

export default Columns;
