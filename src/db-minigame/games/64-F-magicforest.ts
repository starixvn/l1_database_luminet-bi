import { AggregateHelper, BIColumn, BITable, ColumnType } from "@ldb/mongobi-helper";
import Columns from "../../common/columns";
import { columnsBase, pipelineBase } from "../templates/game-base";

const baseName = "magicforest";

/** rounds */
const Rounds = new BITable({
    mongo_name: `${baseName}_rounds`,
    sql_name: `${baseName}_rounds`,
    pipeline: [
        {
            $project: {
                _id: 0,
                ...pipelineBase.gameRound,

                result: AggregateHelper.arrToJSON("$result", 2),
                endTime: 1,
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
        { $match: { $or: [{ playerId: { $gt: 0 } }, { playerId: { $gt: "" } }] } },
        {
            $project: {
                _id: 0,
                ...pipelineBase.slotBet,

                bet: 1,
                betWin: 1,
                bonusChests: AggregateHelper.arrToJSON("$bonusChests"),
                paylines: AggregateHelper.arrToJSON("$paylines"),
                totalAmount: 1,

                stake: { $multiply: ["$totalAmount", { $toInt: { $not: "$freeSpin" } }] },
                payout: "$betWin",
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.slotBet,

        bet: Columns.BET,
        betWin: { mongo_name: "betWin", sql_name: "betwin", ...ColumnType.FLOAT },
        bonusChests: { mongo_name: "bonusChests", sql_name: "bonusChests", ...ColumnType.STR },
        paylines: Columns.PAYLINES,
        totalAmount: Columns.TOTALAMOUNT,

        stake: Columns.STAKE,
        payout: Columns.PAYOUT,
    }) as BIColumn[],
});

/** fames */
const Fames = new BITable({
    mongo_name: `${baseName}_fames`,
    sql_name: `${baseName}_fames`,
    pipeline: [
        {
            $project: {
                _id: 0,
                ...pipelineBase.slotFame,
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.slotFame,
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
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.slotFreeSpin,
    }) as BIColumn[],
});

const magicforestTables = [Rounds, Bets, Fames, FreeSpins];
export default magicforestTables;
