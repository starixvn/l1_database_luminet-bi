import { AggregateHelper, BIColumn, BITable, ColumnType } from "@ldb/mongobi-helper";
import Columns from "../../common/columns";
import { columnsBase, pipelineBase } from "../templates/game-base";

const baseName = "texasholdempoker";
const options = ["ante", "call", "turn", "river"];
const optionOdds = ["calLOdds", "turnOdds", "riverOdds"];

/** rounds */
const Rounds = new BITable({
    mongo_name: `${baseName}_phiens`,
    sql_name: `${baseName}_rounds`,
    pipeline: [
        {
            $project: {
                _id: 0,
                ...pipelineBase.gameRound,
                ended: 1,
                isSwappedOrHold: 1,
                name: 1,
                odds: AggregateHelper.objToJSON("$odds", 2),
                roundStartTime: 1,
                uid: 1,
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.gameRound,
        ended: { mongo_name: "ended", sql_name: "ended", ...ColumnType.BOOL },
        isSwappedOrHold: { mongo_name: "isSwappedOrHold", sql_name: "isSwappedOrHold", ...ColumnType.BOOL },
        name: Columns.NAME,
        odds: Columns.ODDS,
        roundStartTime: { mongo_name: "roundStartTime", sql_name: "roundStartTime", ...ColumnType.DATE },
        uid: Columns.UID,
    }) as BIColumn[],
});

/** bets */
const Bets = new BITable({
    mongo_name: `${baseName}_cuocs`,
    sql_name: `${baseName}_bets`,
    pipeline: [
        { $match: { $or: [{ playerId: { $gt: 0 } }, { playerId: { $gt: "" } }] } },
        {
            $project: {
                _id: 0,
                ...pipelineBase.gameBet,

                bet: 1,
                betwin: 1,
                callTime: 1,
                cards: AggregateHelper.arrToJSON("$cards", 2),
                endTime: 1,
                isFold: 1,
                result: AggregateHelper.objToJSON("$result", 2),
                riverTime: 1,
                settlementResult: AggregateHelper.objToJSON("$result", 2),
                swapTime: 1,
                turnTime: 1,

                stake: "$bet",
                payout: "$betwin",

                ...Object.fromEntries(options.map((o) => [o, 1])),
                ...Object.fromEntries(optionOdds.map((o) => [o, 1])),
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.gameBet,

        bet: Columns.BET,
        betwin: Columns.BETWIN,
        callTime: { mongo_name: "callTime", sql_name: "callTime", ...ColumnType.DATE },
        cards: { mongo_name: "cards", sql_name: "cards", ...ColumnType.STR },
        endTime: { mongo_name: "endTime", sql_name: "endTime", ...ColumnType.DATE },
        isFold: { mongo_name: "isFold", sql_name: "isFold", ...ColumnType.BOOL },
        result: Columns.RESULT,
        riverTime: { mongo_name: "riverTime", sql_name: "riverTime", ...ColumnType.DATE },
        settlementResult: Columns.SETTLEMENTRESULT,
        swapTime: { mongo_name: "swapTime", sql_name: "swapTime", ...ColumnType.DATE },
        turnTime: { mongo_name: "turnTime", sql_name: "turnTime", ...ColumnType.DATE },

        stake: Columns.STAKE,
        payout: Columns.PAYOUT,

        ...Object.fromEntries(options.map((o) => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT }])),
        ...optionOdds.map((o) => ({ mongo_name: o, sql_name: o, ...ColumnType.FLOAT })),
    }) as BIColumn[],
});

const texasholdempokerTables = [Rounds, Bets];
export default texasholdempokerTables;
