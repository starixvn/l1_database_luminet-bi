import { AggregateHelper, BIColumn, BITable, ColumnType } from '@ldb/mongobi-helper';
import Columns from '../common/columns';

/** archive_statuses */
const archiveStatuses = new BITable({
  mongo_name: 'archive_statuses',
  sql_name  : 'archive_statuses',
  pipeline  : [
    { $project: {
      _id: 0,
      name       : 1,
      _phiens    : '$lastArcId._phiens',
      _rounds    : '$lastArcId._rounds',
      _cuocs     : '$lastArcId._cuocs',
      _freespins : '$lastArcId._freespins',
    } },
  ],
  columns   : Object.values({
    name       : Columns.NAME,
    _phiens    : { mongo_name: '_phiens'   , sql_name: '_phiens'   , ...ColumnType.INT64  },
    _rounds    : { mongo_name: '_rounds'   , sql_name: '_rounds'   , ...ColumnType.INT64  },
    _cuocs     : { mongo_name: '_cuocs'    , sql_name: '_cuocs'    , ...ColumnType.INT64  },
    _freespins : { mongo_name: '_freespins', sql_name: '_freespins', ...ColumnType.INT64  },
    _filter    : Columns.FILTER,
  }) as BIColumn[],
});

/** chips */
const chips = new BITable({
  mongo_name: 'chips',
  sql_name  : 'chips',
  pipeline  : [
    { $project: { _id: 0, text: 1, value: 1, color: 1 } },
  ],
  columns   : Object.values({
    text    : { mongo_name: 'text' , sql_name: 'text' , ...ColumnType.STR    },
    value   : { mongo_name: 'value', sql_name: 'value', ...ColumnType.FLOAT  },
    color   : { mongo_name: 'color', sql_name: 'color', ...ColumnType.STR    },
    _filter : Columns.FILTER,
  }) as BIColumn[],
});

/** currencies */
const currencies = new BITable({
  mongo_name: 'currencies',
  sql_name  : 'currencies',
  pipeline  : [
    { $project: { _id: 0, name: 1, code: 1, multiplier: 1, enabled: 1, isTest: 1, partnerId: 1, groupId: 1 } },
  ],
  columns   : Object.values({
    name       : Columns.NAME,
    code       : { mongo_name: 'code'      , sql_name: 'code'      , ...ColumnType.STR    },
    multiplier : { mongo_name: 'multiplier', sql_name: 'multiplier', ...ColumnType.FLOAT  },
    enabled    : Columns.ENABLED,
    isTest     : { mongo_name: 'isTest'    , sql_name: 'isTest'    , ...ColumnType.BOOL   },
    partnerId  : { mongo_name: 'partnerId' , sql_name: 'partnerId' , ...ColumnType.STR    },
    groupId    : { mongo_name: 'groupId'   , sql_name: 'groupId'   , ...ColumnType.OID    },
    _filter    : Columns.FILTER,
  }) as BIColumn[],
});

/** currency_group_games */
const currencyGroupGames = new BITable({
  mongo_name: 'currency_group_games',
  sql_name  : 'currency_group_games',
  pipeline  : [
    { $project: {
      _id: 0, groupId: 1, gameId: 1, gameName: 1, enabled: 1, minBet: 1, maxBet: 1, maxWinPerRound: 1,
      maxBetPerChoices : AggregateHelper.objToJSON('$maxBetPerChoices'),
      chips            : AggregateHelper.arrToJSON('$chips'),
      coinValues       : AggregateHelper.arrToJSON('$coinValues'),
      stakeLevels      : AggregateHelper.arrToJSON('$stakeLevels'),
    } },
  ],
  columns   : Object.values({
    groupId          : { mongo_name: 'groupId'         , sql_name: 'groupId'         , ...ColumnType.OID    },
    gameId           : { mongo_name: 'gameId'          , sql_name: 'gameId'          , ...ColumnType.INT64  },
    gameName         : { mongo_name: 'gameName'        , sql_name: 'gameName'        , ...ColumnType.STR    },
    enabled          : Columns.ENABLED,
    minBet           : { mongo_name: 'minBet'          , sql_name: 'minBet'          , ...ColumnType.FLOAT  },
    maxBet           : { mongo_name: 'maxBet'          , sql_name: 'maxBet'          , ...ColumnType.FLOAT  },
    maxWinPerRound   : { mongo_name: 'maxWinPerRound'  , sql_name: 'maxWinPerRound'  , ...ColumnType.FLOAT  },
    maxBetPerChoices : { mongo_name: 'maxBetPerChoices', sql_name: 'maxBetPerChoices', ...ColumnType.FLOAT  },
    chips            : { mongo_name: 'chips'           , sql_name: 'chips'           , ...ColumnType.STR    },
    coinValues       : { mongo_name: 'coinValues'      , sql_name: 'coinValues'      , ...ColumnType.STR    },
    stakeLevels      : { mongo_name: 'stakeLevels'     , sql_name: 'stakeLevels'     , ...ColumnType.STR    },
    _filter : Columns.FILTER,
  }) as BIColumn[],
});

/** currency_groups */
const currencyGroups = new BITable({
  mongo_name: 'currency_groups',
  sql_name  : 'currency_groups',
  pipeline  : [
    { $project: { _id: 1, name: 1, enabled: 1, partnerId: 1 } },
  ],
  columns   : Object.values({
    _id       : Columns._ID,
    name      : Columns.NAME,
    enabled   : Columns.ENABLED,
    partnerId : { mongo_name: 'partnerId' , sql_name: 'partnerId' , ...ColumnType.STR    },
    _filter   : Columns.FILTER,
  }) as BIColumn[],
});

/** exchange_rates */
const exchangeRates = new BITable({
  mongo_name: 'exchange_rates',
  sql_name  : 'exchange_rates',
  pipeline  : [
    { $project: {
      _id: 0, time: 1, exDate:1, exId: 1, source: 1,
      code      : { $objectToArray: '$code' },
      archived  : { $ifNull: [{ $toBool: '$__archive.eventtime' }, false] },
    } },
    { $unwind: '$code' },
    { $project : {
      time: 1, exDate:1, exId: 1, source: 1,
      code: '$code.k', rate: '$code.v',
      archived: 1,
    } },
  ],
  columns   : Object.values({
    time     : Columns.TIME,
    exDate   : { mongo_name: 'exDate'  , sql_name: 'exDate'  , ...ColumnType.DATE   },
    exId     : { mongo_name: 'exId'    , sql_name: 'exId'    , ...ColumnType.INT64  },
    source   : { mongo_name: 'source'  , sql_name: 'source'  , ...ColumnType.STR    },
    code     : { mongo_name: 'code'    , sql_name: 'code'    , ...ColumnType.STR    },
    rate     : Columns.RATE,
    archived : Columns.ARCHIVED,
    _filter  : Columns.FILTER,
  }) as BIColumn[],
});

/** game_configs */
const gameConfigs = new BITable({
  mongo_name: 'game_configs',
  sql_name  : 'game_configs',
  pipeline  : [
    { $project: {
      _id: 0, time: 1, type: 1, name: 1, enabled: 1, botenabled: 1,
      minbet: 1, maxbet: 1, disabledround: 1, bot_maxbet: 1, disabled_message: 1,
      delayStartTime: 1, enableFreeBet: 1, smartBotEnabled: 1, smartBotGroupRatio: 1,
      exchangeReload: 1, isBeta: 1, gameId: 1,
      hour_maxbot    : AggregateHelper.arrToJSON('$hour_maxbot'),
      choices_maxbet : AggregateHelper.objToJSON('$choices_maxbet'),
      odds           : AggregateHelper.objToJSON('$odds'),
    } },
  ],
  columns   : Object.values({
    time               : Columns.TIME,
    type               : { mongo_name: 'type'              , sql_name: 'type'              , ...ColumnType.INT64  },
    name               : Columns.NAME,
    enabled            : Columns.ENABLED,
    botenabled         : { mongo_name: 'botenabled'        , sql_name: 'botEnabled'        , ...ColumnType.BOOL   },
    minbet             : { mongo_name: 'minbet'            , sql_name: 'minBet'            , ...ColumnType.FLOAT  },
    maxbet             : { mongo_name: 'maxbet'            , sql_name: 'maxBet'            , ...ColumnType.FLOAT  },
    disabledround      : { mongo_name: 'disabledround'     , sql_name: 'disabledRound'     , ...ColumnType.INT64  },
    bot_maxbet         : { mongo_name: 'bot_maxbet'        , sql_name: 'botMaxBet'         , ...ColumnType.FLOAT  },
    disabled_message   : { mongo_name: 'disabled_message'  , sql_name: 'disabledMessage'   , ...ColumnType.STR    },
    delayStartTime     : { mongo_name: 'delayStartTime'    , sql_name: 'delayStartTime'    , ...ColumnType.FLOAT  },
    enableFreeBet      : { mongo_name: 'enableFreeBet'     , sql_name: 'enableFreeBet'     , ...ColumnType.BOOL   },
    smartBotEnabled    : { mongo_name: 'smartBotEnabled'   , sql_name: 'smartBotEnabled'   , ...ColumnType.BOOL   },
    smartBotGroupRatio : { mongo_name: 'smartBotGroupRatio', sql_name: 'smartBotGroupRatio', ...ColumnType.FLOAT  },
    exchangeReload     : { mongo_name: 'exchangeReload'    , sql_name: 'exchangeReload'    , ...ColumnType.BOOL   },
    isBeta             : { mongo_name: 'isBeta'            , sql_name: 'isBeta'            , ...ColumnType.BOOL   },
    gameId             : { mongo_name: 'gameId'            , sql_name: 'gameId'            , ...ColumnType.INT64  },
    hour_maxbot        : { mongo_name: 'hour_maxbot'       , sql_name: 'hourMaxBot'        , ...ColumnType.STR    },
    choices_maxbet     : { mongo_name: 'choices_maxbet'    , sql_name: 'choicesMaxBet'     , ...ColumnType.STR    },
    odds               : { mongo_name: 'odds'              , sql_name: 'odds'              , ...ColumnType.STR    },
    _filter            : Columns.FILTER,
  }) as BIColumn[],
});

/** global_configs */
const exchangeCodes = new BITable({
  mongo_name: 'global_configs',
  sql_name  : 'exchange_codes',
  pipeline  : [
    { $match: { type: 'exchange_codes' } },
    { $unwind: '$configs.codes' },
    { $project : {
      _id: 0, time: 1, base: 1,
      codes : '$configs.codes',
    } },
  ],
  columns   : Object.values({
    time    : Columns.TIME,
    base    : { mongo_name: 'base' , sql_name: 'base' , ...ColumnType.STR    },
    codes   : { mongo_name: 'codes', sql_name: 'codes', ...ColumnType.STR    },
    _filter : Columns.FILTER,
  }) as BIColumn[],
});
const kenoMatchLiveOddsBlueRed = new BITable({
  mongo_name: 'global_configs',
  sql_name  : 'kenomatch_liveodds_bluered',
  pipeline  : [
    { $match: { type: 'kenomatch_liveodds' } },
    { $project : { _id: 0, blueRed : { $objectToArray: '$blueRed' } } },
    { $unwind: '$blueRed' },
    { $project: {
      val         : { $toInt: '$blueRed.k' },
      liveFTBlue  : '$blueRed.v.liveFTBlue',
      liveFTRed   : '$blueRed.v.liveFTRed',
    } },
  ],
  columns   : Object.values({
    val        : { mongo_name: 'val'       , sql_name: 'val'       , ...ColumnType.INT64  },
    liveFTBlue : { mongo_name: 'liveFTBlue', sql_name: 'liveFTBlue', ...ColumnType.FLOAT  },
    liveFTRed  : { mongo_name: 'liveFTRed' , sql_name: 'liveFTRed' , ...ColumnType.FLOAT  },
    _filter    : Columns.FILTER,
  }) as BIColumn[],
});
const kenoMatchLiveOddsOverUnder = new BITable({
  mongo_name: 'global_configs',
  sql_name  : 'kenomatch_liveodds_bluered',
  pipeline  : [
    { $match: { type: 'kenomatch_liveodds' } },
    { $project : { _id: 0, blueRed : { $objectToArray: '$overUnder' } } },
    { $unwind: '$overUnder' },
    { $project: {
      val         : { $toInt: '$overUnder.k' },
      liveFTOver  : '$overUnder.v.liveFTOver',
      liveFTUnder : '$overUnder.v.liveFTUnder',
    } },
  ],
  columns   : Object.values({
    val         : { mongo_name: 'val'        , sql_name: 'val'        , ...ColumnType.INT64  },
    liveFTOver  : { mongo_name: 'liveFTOver' , sql_name: 'liveFTOver' , ...ColumnType.FLOAT  },
    liveFTUnder : { mongo_name: 'liveFTUnder', sql_name: 'liveFTUnder', ...ColumnType.FLOAT  },
    _filter     : Columns.FILTER,
  }) as BIColumn[],
});

/** idcounters */
const idCounters = new BITable({
  mongo_name: 'idcounters',
  sql_name  : 'idcounters',
  pipeline  : [
    { $project: { _id: 0, m: 1, f: 1, c: 1 } },
  ],
  columns   : Object.values({
    m       : { mongo_name: 'm', sql_name: 'model'  , ...ColumnType.STR    },
    f       : { mongo_name: 'f', sql_name: 'field'  , ...ColumnType.STR    },
    c       : { mongo_name: 'c', sql_name: 'counter', ...ColumnType.INT64  },
    _filter : Columns.FILTER,
  }) as BIColumn[],
});

/** jackpots */
const jackpots = new BITable({
  mongo_name: 'jackpots',
  sql_name  : 'jackpots',
  pipeline  : [
    { $project: {
      _id: 0, amount: 1, byBots: 1, byMembers: 1, gameId: 1, gameName: 1, pool: 1, initAmount: 1,
      createdAt: 1, createdTime: 1, hitAt: 1, hitTime: 1, winnerId: 1, winnerName: 1, winningRatio: 1,
      archived  : { $ifNull: [{ $toBool: '$__archive.eventtime' }, false] },
    } },
  ],
  columns   : Object.values({
    amount       : { mongo_name: 'amount'      , sql_name: 'amount'      , ...ColumnType.FLOAT  },
    byBots       : { mongo_name: 'byBots'      , sql_name: 'byBots'      , ...ColumnType.FLOAT  },
    byMembers    : { mongo_name: 'byMembers'   , sql_name: 'byMembers'   , ...ColumnType.FLOAT  },
    gameId       : { mongo_name: 'gameId'      , sql_name: 'gameId'      , ...ColumnType.INT64  },
    gameName     : { mongo_name: 'gameName'    , sql_name: 'gameName'    , ...ColumnType.STR    },
    pool         : { mongo_name: 'pool'        , sql_name: 'pool'        , ...ColumnType.FLOAT  },
    initAmount   : { mongo_name: 'initAmount'  , sql_name: 'initAmount'  , ...ColumnType.FLOAT  },
    createdAt    : { mongo_name: 'createdAt'   , sql_name: 'createdAt'   , ...ColumnType.INT64  },
    createdTime  : { mongo_name: 'createdTime' , sql_name: 'createdTime' , ...ColumnType.DATE   },
    hitAt        : { mongo_name: 'hitAt'       , sql_name: 'hitAt'       , ...ColumnType.INT64  },
    hitTime      : { mongo_name: 'hitTime'     , sql_name: 'hitTime'     , ...ColumnType.DATE   },
    winnerId     : { mongo_name: 'winnerId'    , sql_name: 'winnerId'    , ...ColumnType.INT64  },
    winnerName   : { mongo_name: 'winnerName'  , sql_name: 'winnerName'  , ...ColumnType.STR    },
    winningRatio : { mongo_name: 'winningRatio', sql_name: 'winningRatio', ...ColumnType.FLOAT  },
    archived     : Columns.ARCHIVED,
    _filter      : Columns.FILTER,
  }) as BIColumn[],
});

/** partners */
const partners = new BITable({
  mongo_name: 'partners',
  sql_name  : 'partners',
  pipeline  : [
    { $project: {
      _id: 0, partnerId: 1, name: 1, clubVersionUrl: 1, mobiVersionUrl: 1, miniVersionUrl: 1, testCurrencyUrl: 1,
    } },
  ],
  columns   : Object.values({
    partnerId       : { mongo_name: 'partnerId'      , sql_name: 'partnerId'      , ...ColumnType.STR    },
    name            : Columns.NAME,
    clubVersionUrl  : { mongo_name: 'clubVersionUrl' , sql_name: 'clubVersionUrl' , ...ColumnType.STR    },
    mobiVersionUrl  : { mongo_name: 'mobiVersionUrl' , sql_name: 'mobiVersionUrl' , ...ColumnType.STR    },
    miniVersionUrl  : { mongo_name: 'miniVersionUrl' , sql_name: 'miniVersionUrl' , ...ColumnType.STR    },
    testCurrencyUrl : { mongo_name: 'testCurrencyUrl', sql_name: 'testCurrencyUrl', ...ColumnType.STR    },
    _filter         : Columns.FILTER,
  }) as BIColumn[],
});

/** spins */
const spins = new BITable({
  mongo_name: 'spins',
  sql_name  : 'spins',
  pipeline  : [
    { $project: {
      _id: 0, memberId: 1, availSpins: 1, usedSpins: 1, enabled: 1,
    } },
  ],
  columns   : Object.values({
    memberId   : { mongo_name: 'memberId'  , sql_name: 'memberId'  , ...ColumnType.INT64  },
    availSpins : { mongo_name: 'availSpins', sql_name: 'availSpins', ...ColumnType.INT64  },
    usedSpins  : { mongo_name: 'usedSpins' , sql_name: 'usedSpins' , ...ColumnType.INT64  },
    enabled    : Columns.ENABLED,
    _filter    : Columns.FILTER,
  }) as BIColumn[],
});

/** spin_logs */
const spinLogs = new BITable({
  mongo_name: 'spin_logs',
  sql_name  : 'spin_logs',
  pipeline  : [
    { $project: {
      _id: 0, roundId: 1, memberId: 1, spinCnt: 1, expiryDate: 1, time: 1, key: 1, source: 1,
    } },
  ],
  columns   : Object.values({
    roundId    : Columns.ROUNDID,
    memberId   : { mongo_name: 'memberId'  , sql_name: 'memberId'  , ...ColumnType.INT64  },
    spinCnt    : { mongo_name: 'spinCnt'   , sql_name: 'spinCnt'   , ...ColumnType.INT64  },
    expiryDate : { mongo_name: 'expiryDate', sql_name: 'expiryDate', ...ColumnType.DATE   },
    time       : Columns.TIME,
    key        : { mongo_name: 'key'       , sql_name: 'key'       , ...ColumnType.STR    },
    source     : { mongo_name: 'source'    , sql_name: 'source'    , ...ColumnType.STR    },
    _filter    : Columns.FILTER,
  }) as BIColumn[],
});

/** spin_results */
const spinResults = new BITable({
  mongo_name: 'spin_results',
  sql_name  : 'spin_results',
  pipeline  : [
    { $project: {
      _id: 0, time: 1, uid: 1, name: 1, result: 1, memberId: 1, siteId: 1, id: 1,
    } },
  ],
  columns   : Object.values({
    time     : Columns.TIME,
    uid      : Columns.UID,
    name     : Columns.NAME,
    result   : { mongo_name: 'result'  , sql_name: 'result'  , ...ColumnType.FLOAT  },
    memberId : { mongo_name: 'memberId', sql_name: 'memberId', ...ColumnType.INT64  },
    siteId   : Columns.SITEID,
    id       : Columns.ID,
    _filter  : Columns.FILTER,
  }) as BIColumn[],
});

/** um_info */
const umInfo = new BITable({
  mongo_name: 'um_info',
  sql_name  : 'um_info',
  pipeline  : [
    { $project: {
      _id: 0, time: 1, start: 1, end: 1, finish: 1,
    } },
  ],
  columns   : Object.values({
    time    : Columns.TIME,
    start   : { mongo_name: 'start' , sql_name: 'start' , ...ColumnType.DATE   },
    end     : { mongo_name: 'end'   , sql_name: 'end'   , ...ColumnType.DATE   },
    finish  : { mongo_name: 'finish', sql_name: 'finish', ...ColumnType.BOOL   },
    _filter : Columns.FILTER,
  }) as BIColumn[],
});

/** userinfos */
const userInfos = new BITable({
  mongo_name: 'userinfos',
  sql_name  : 'userinfos',
  pipeline  : [
    { $project: {
      _id: 0, name: 1, UID: 1, banned: 1, currency: 1, disabled: 1, id: 1, inGameRoom: 1, inRoom: 1, isSignedInSM: 1,
      joinedOn: 1, maxBet: 1, minBet: 1, red: 1, redLost: 1, redPlay: 1, redWin: 1, scoins: 1, type: 1, betLimitModifiedDate: 1,
    } },
  ],
  columns   : Object.values({
    name                 : Columns.NAME,
    UID                  : { mongo_name: 'UID'                 , sql_name: 'UID'                 , ...ColumnType.INT64  },
    banned               : { mongo_name: 'banned'              , sql_name: 'banned'              , ...ColumnType.BOOL   },
    currency             : Columns.CURRENCY,
    disabled             : { mongo_name: 'disabled'            , sql_name: 'disabled'            , ...ColumnType.BOOL   },
    id                   : { mongo_name: 'id'                  , sql_name: 'id'                  , ...ColumnType.STR    },
    inGameRoom           : { mongo_name: 'inGameRoom'          , sql_name: 'inGameRoom'          , ...ColumnType.STR    },
    inRoom               : { mongo_name: 'inRoom'              , sql_name: 'inRoom'              , ...ColumnType.BOOL   },
    isSignedInSM         : { mongo_name: 'isSignedInSM'        , sql_name: 'isSignedInSM'        , ...ColumnType.BOOL   },
    joinedOn             : { mongo_name: 'joinedOn'            , sql_name: 'joinedOn'            , ...ColumnType.DATE   },
    maxBet               : { mongo_name: 'maxBet'              , sql_name: 'maxBet'              , ...ColumnType.FLOAT  },
    minBet               : { mongo_name: 'minBet'              , sql_name: 'minBet'              , ...ColumnType.FLOAT  },
    red                  : { mongo_name: 'red'                 , sql_name: 'red'                 , ...ColumnType.FLOAT  },
    redLost              : { mongo_name: 'redLost'             , sql_name: 'redLost'             , ...ColumnType.FLOAT  },
    redPlay              : { mongo_name: 'redPlay'             , sql_name: 'redPlay'             , ...ColumnType.FLOAT  },
    redWin               : { mongo_name: 'redWin'              , sql_name: 'redWin'              , ...ColumnType.FLOAT  },
    scoins               : { mongo_name: 'scoins'              , sql_name: 'scoins'              , ...ColumnType.FLOAT  },
    type                 : { mongo_name: 'type'                , sql_name: 'isBot'               , ...ColumnType.BOOL   },
    betLimitModifiedDate :{ mongo_name: 'betLimitModifiedDate', sql_name: 'betLimitModifiedDate', ...ColumnType.DATE   },
    _filter              : Columns.FILTER,
  }) as BIColumn[],
});

/** users */
const users = new BITable({
  mongo_name: 'users',
  sql_name  : 'users',
  pipeline  : [
    { $project: { 'local.password': 0, __v: 0 } },
  ],
  columns   : Object.values({
    _id        : Columns._ID,
    ban_pass   : { mongo_name: 'local.ban_pass'  , sql_name: 'banPass'   , ...ColumnType.INT64  },
    ban_login  : { mongo_name: 'local.ban_login' , sql_name: 'banLogin'  , ...ColumnType.BOOL   },
    username   : { mongo_name: 'local.username'  , sql_name: 'username'  , ...ColumnType.STR    },
    regDate    : { mongo_name: 'local.regDate'   , sql_name: 'regDate'   , ...ColumnType.DATE   },
    memberId   : { mongo_name: 'local.memberId'  , sql_name: 'memberId'  , ...ColumnType.INT64  },
    memberName : { mongo_name: 'local.memberName', sql_name: 'memberName', ...ColumnType.STR    },
    clientId   : { mongo_name: 'local.clientId'  , sql_name: 'clientId'  , ...ColumnType.STR    },
    currency   : { mongo_name: 'local.currency'  , sql_name: 'currency'  , ...ColumnType.STR    },
    operatorId : Columns.OPERATORID,
    playerId   : Columns.PLAYERID,
    _filter    : Columns.FILTER,
  }) as BIColumn[],
});

/** usersessions */
const userSessions = new BITable({
  mongo_name: 'usersessions',
  sql_name  : 'usersessions',
  pipeline  : [
    { $project: {
      _id: 0, username: 1, memberId: 1, ssoTime: 1, recheckInTime: 1, ip: 1, browserUserAgent: 1, siteId: 1,  userId: 1,
      language: 1, currencyCode: 1, currencyName: 1, currencyGroupId: 1, isTestCurrency: 1, multiplier: 1,  partnerId: 1,
      memberName: 1, siteName: 1, system: 1, operatorId: 1, playerId: 1, playerName: 1,
      archived  : { $ifNull: [{ $toBool: '$__archive.eventtime' }, false] },
    } },
  ],
  columns   : Object.values({
    username         : { mongo_name: 'username'        , sql_name: 'username'        , ...ColumnType.STR    },
    memberId         : { mongo_name: 'memberId'        , sql_name: 'memberId'        , ...ColumnType.INT64  },
    ssoTime          : { mongo_name: 'ssoTime'         , sql_name: 'ssoTime'         , ...ColumnType.DATE   },
    recheckInTime    : { mongo_name: 'recheckInTime'   , sql_name: 'recheckInTime'   , ...ColumnType.DATE   },
    ip               : { mongo_name: 'ip'              , sql_name: 'ip'              , ...ColumnType.STR    },
    browserUserAgent : { mongo_name: 'browserUserAgent', sql_name: 'browserUserAgent', ...ColumnType.STR    },
    siteId           : Columns.SITEID,
    userId           : { mongo_name: 'userId'          , sql_name: 'userId'          , ...ColumnType.STR    },
    language         : { mongo_name: 'language'        , sql_name: 'language'        , ...ColumnType.STR    },
    currencyCode     : { mongo_name: 'currencyCode'    , sql_name: 'currencyCode'    , ...ColumnType.STR    },
    currencyName     : { mongo_name: 'currencyName'    , sql_name: 'currencyName'    , ...ColumnType.STR    },
    currencyGroupId  : { mongo_name: 'currencyGroupId' , sql_name: 'currencyGroupId' , ...ColumnType.STR    },
    isTestCurrency   : { mongo_name: 'isTestCurrency'  , sql_name: 'isTestCurrency'  , ...ColumnType.BOOL   },
    multiplier       : { mongo_name: 'multiplier'      , sql_name: 'multiplier'      , ...ColumnType.FLOAT  },
    partnerId        : { mongo_name: 'partnerId'       , sql_name: 'partnerId'       , ...ColumnType.STR    },
    memberName       : { mongo_name: 'memberName'      , sql_name: 'memberName'      , ...ColumnType.STR    },
    siteName         : { mongo_name: 'siteName'        , sql_name: 'siteName'        , ...ColumnType.STR    },
    system           : { mongo_name: 'system'          , sql_name: 'system'          , ...ColumnType.INT64  },
    operatorId       : Columns.OPERATORID,
    playerId         : Columns.PLAYERID,
    playerName       : { mongo_name: 'playerName'      , sql_name: 'playerName'      , ...ColumnType.STR    },
    archived         : Columns.ARCHIVED,
    _filter          : Columns.FILTER,
  }) as BIColumn[],
});

const commonTables = [
  archiveStatuses, chips, currencies, currencyGroupGames, currencyGroups, exchangeRates, gameConfigs,
  exchangeCodes, kenoMatchLiveOddsBlueRed, kenoMatchLiveOddsOverUnder,
  idCounters, jackpots, partners, spins, spinLogs, spinResults, umInfo, userInfos, users, userSessions,
];
export default commonTables;
