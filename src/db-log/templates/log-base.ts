import { AggregateHelper } from '@ldb/mongobi-helper';
import Columns from '../../common/columns';

export const pipelineBase = {
  apiLog: {
    logTimeStamp      : 1,
    requestTimeStamp  : 1,
    responseTimeStamp : 1,
    call              : 1,
    result            : 1,
    rawCall           : AggregateHelper.objToJSON('$call', 3),
    rawResult         : AggregateHelper.objToJSON('$result', 3),
    archived          : { $ifNull: [{ $toBool: '$__archive.eventtime' }, false] },
  },
  apiv2Log : {
    logTimeStamp      : 1,
    requestTimeStamp  : 1,
    responseTimeStamp : 1,
    request           : 1,
    result            : 1,
    rawRequest        : AggregateHelper.objToJSON('$request', 3),
    rawResult         : AggregateHelper.objToJSON('$result', 3),
    archived          : { $ifNull: [{ $toBool: '$__archive.eventtime' }, false] },
  },
};

export const columnsBase = {
  apiLog: [
    Columns.LOGTS,
    Columns.REQTS,
    Columns.RESTS,

    Columns.ARCHIVED,
    Columns.FILTER,
  ],
  apiv2Log: [
    Columns.LOGTS,
    Columns.REQTS,
    Columns.RESTS,
    
    Columns.ARCHIVED,
    Columns.FILTER,
  ],
};
