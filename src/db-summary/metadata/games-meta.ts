import { BIColumn, BITable, ColumnType } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';

/** game_summary_config */
const GameConfig = new BITable({
  mongo_name: 'game_summary_config',
  sql_name  : 'game_summary_config',
  pipeline  : [
    { $project: {
      _id: 0,
    } },
  ],
  columns   : Object.values({
    vendorId     : { mongo_name: 'vendorId'    , sql_name: 'vendorId'  , ...ColumnType.INT64  },
    gameId       : { mongo_name: 'gameId'      , sql_name: 'gameId'    , ...ColumnType.INT64  },
    owGameTypeId : { mongo_name: 'owGameTypeId', sql_name: 'gameTypeId', ...ColumnType.INT64  },
    nameEN       : { mongo_name: 'name.en'     , sql_name: 'nameEN'    , ...ColumnType.STR    },
    nameVI       : { mongo_name: 'name.vi'     , sql_name: 'nameVI'    , ...ColumnType.STR    },
    groupName    : { mongo_name: 'name.grp'    , sql_name: 'groupName' , ...ColumnType.STR    },
    gameName     : { mongo_name: 'name.game'   , sql_name: 'gameName'  , ...ColumnType.STR    },
    db           : { mongo_name: 'coll.db'     , sql_name: 'db'        , ...ColumnType.STR    },
    coll         : { mongo_name: 'coll.group'  , sql_name: 'coll'      , ...ColumnType.STR    },
    _fitter      : Columns.FILTER,
  }) as BIColumn[],
});

const gamesMetaTables = [GameConfig];
export default gamesMetaTables;
