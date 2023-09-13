import { AggregateHelper, BIColumn, BITable, ColumnType } from "@ldb/mongobi-helper";
import Columns from "../../common/columns";
import { columnsBase, pipelineBase } from "../templates/game-base";

const baseName = "treasureisland";

/** rounds */
const Rounds = new BITable({
    mongo_name: `${baseName}_rounds`,
    sql_name: `${baseName}_rounds`,
    pipeline: [
        {
            $project: {
                _id: 0,
                ...pipelineBase.gameRound,
                endTime: 1,
                result: 1,
                settlementResult: AggregateHelper.objToJSON("$settlementResult", 3),
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.gameRound,
        endTime: { mongo_name: "endTime", sql_name: "endTime", ...ColumnType.DATE },
    }) as BIColumn[],
});

/** bets */
const Bets = new BITable({
    mongo_name: `${baseName}_rounds`,
    sql_name: `${baseName}_bets`,
    pipeline: [
        { $match: { playerId: { $gt: 0 } } },
        {
            $project: {
                _id: 0,
                ...pipelineBase.slotBet,

                betwin: 1,
                betLevel: 1,
                betMultiplier: 1,
                coinValue: 1,
                multiplier: 1,
                reachMaxWin: 1,
                totalAmount: 1,
                totalMultiplier: 1,
                totalTumbleWin: 1,
                odds: AggregateHelper.objToJSON("$odds", 3),

                stake: { $multiply: ["$totalAmount", { $toInt: { $not: "$freeSpin" } }] },
                payout: "$betwin",
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.slotBet,

        betwin: Columns.BETWIN,
        betLevel: { mongo_name: "betLevel", sql_name: "betLevel", ...ColumnType.FLOAT },
        betMultiplier: { mongo_name: "betMultiplier", sql_name: "betMultiplier", ...ColumnType.FLOAT },
        coinValue: { mongo_name: "coinValue", sql_name: "coinValue", ...ColumnType.FLOAT },
        multiplier: { mongo_name: "multiplier", sql_name: "multiplier", ...ColumnType.FLOAT },
        reachMaxWin: { mongo_name: "reachMaxWin", sql_name: "reachMaxWin", ...ColumnType.BOOL },
        totalAmount: Columns.TOTALAMOUNT,
        totalMultiplier: { mongo_name: "totalMultiplier", sql_name: "totalMultiplier", ...ColumnType.FLOAT },
        totalTumbleWin: { mongo_name: "totalTumbleWin", sql_name: "totalTumbleWin", ...ColumnType.FLOAT },
        odds: Columns.ODDS,

        stake: Columns.STAKE,
        payout: Columns.PAYOUT,
    }) as BIColumn[],
});

/** freespins */
const FreeSpins = new BITable({
    mongo_name: `${baseName}_freespins`,
    sql_name: `${baseName}_freespins`,
    pipeline: [
        {
            $project: {
                _id: 0,
                ...pipelineBase.slotFreeSpin,

                betLevel: 1,
                betMultiplier: 1,
                coinValue: 1,
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.slotFreeSpin,

        betLevel: { mongo_name: "betLevel", sql_name: "betLevel", ...ColumnType.FLOAT },
        betMultiplier: { mongo_name: "betMultiplier", sql_name: "betMultiplier", ...ColumnType.FLOAT },
        coinValue: { mongo_name: "coinValue", sql_name: "coinValue", ...ColumnType.FLOAT },
    }) as BIColumn[],
});

/** multipliers */
const Multipliers = new BITable({
    mongo_name: `${baseName}_multipliers`,
    sql_name: `${baseName}_multipliers`,
    pipeline: [
        {
            $project: {
                _id: 0,
                ended: 1,
                endTime: 1,
                name: 1,
                playerId: 1,
                time: 1,
                uid: 1,
                rounds: AggregateHelper.arrToJSON("$rounds", 2),
                archived: { $ifNull: [{ $toBool: "$__archive.eventtime" }, false] },
            },
        },
    ],
    columns: Object.values({
        ended: { mongo_name: "ended", sql_name: "ended", ...ColumnType.BOOL },
        endTime: { mongo_name: "endTime", sql_name: "endTime", ...ColumnType.DATE },
        name: Columns.NAME,
        playerId: Columns.PLAYERID,
        time: Columns.TIME,
        uid: Columns.UID,
        rounds: { mongo_name: "rounds", sql_name: "rounds", ...ColumnType.STR },
        archived: Columns.ARCHIVED,
        _filter: Columns.FILTER,
    }) as BIColumn[],
});

const treasureislandTables = [Rounds, Bets, FreeSpins, Multipliers];
export default treasureislandTables;
