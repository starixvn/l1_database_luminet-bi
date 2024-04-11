import { BIColumn, BITable, ColumnType } from "@ldb/mongobi-helper";
import Columns from "../../common/columns";
import { columnsBase, pipelineBase } from "../templates/game-base";

const baseName = "txturbo";
const options = ["big", "small"];

/** rounds */
const Rounds = new BITable({
    mongo_name: `${baseName}_phiens`,
    sql_name: `${baseName}_rounds`,
    pipeline: [
        {
            $project: {
                _id: 0,
                ...pipelineBase.gameRound,
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.gameRound,
    }) as BIColumn[],
});

/** bets */
const Bets = new BITable({
    mongo_name: `${baseName}_ones`,
    sql_name: `${baseName}_bets`,
    pipeline: [
        { $match: { $or: [{ playerId: { $gt: 0 } }, { playerId: { $gt: "" } }] } },
        {
            $project: {
                _id: 0,
                ...pipelineBase.gameBet,
                amount: 1,
                baseAmount: 1,
                baseBetWin: 1,
                baseRefund: 1,
                baseTotalWin: 1,
                betwin: 1,
                choice: 1,
                refund: 1,
                totalAmount: 1,
                totalWin: 1,
                win: 1,

                stake: "$amount",
                payout: "$totalWin",

                ...Object.fromEntries(options.map((o) => [o, { $cond: [{ $eq: ["$choice", o] }, "$totalAmount", 0] }])),
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.gameBet,

        amount: Columns.AMOUNT,
        baseAmount: Columns.BASEAMOUNT,
        baseBetWin: Columns.BASEBETWIN,
        baseRefund: Columns.BASEREFUND,
        baseTotalWin: Columns.BASETOTALWIN,
        betwin: Columns.BETWIN,
        choice: { mongo_name: "choice", sql_name: "choice", ...ColumnType.STR },
        refund: Columns.REFUND,
        totalAmount: Columns.TOTALAMOUNT,
        totalWin: Columns.TOTALWIN,
        win: { mongo_name: "win", sql_name: "win", ...ColumnType.BOOL },

        stake: Columns.STAKE,
        payout: Columns.PAYOUT,

        ...Object.fromEntries(options.map((o) => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT }])),
    }) as BIColumn[],
});

/** betlogs */
const BetLogs = new BITable({
    mongo_name: `${baseName}_cuocs`,
    sql_name: `${baseName}_betlogs`,
    pipeline: [
        { $match: { $or: [{ playerId: { $gt: 0 } }, { playerId: { $gt: "" } }] } },
        {
            $project: {
                _id: 0,
                ...pipelineBase.gameBetLog,

                amount: 1,
                baseAmount: 1,
                baseBetWin: 1,
                baseRefund: 1,
                baseTotalWin: 1,
                betwin: 1,
                choice: 1,
                refund: 1,
                totalWin: 1,
                win: 1,

                stake: "$amount",
                payout: "$totalWin",

                ...Object.fromEntries(options.map((o) => [o, { $cond: [{ $eq: ["$choice", o] }, "$totalAmount", 0] }])),
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.gameBetLog,

        amount: Columns.AMOUNT,
        baseAmount: Columns.BASEAMOUNT,
        baseBetWin: Columns.BASEBETWIN,
        baseRefund: Columns.BASEREFUND,
        baseTotalWin: Columns.BASETOTALWIN,
        betwin: Columns.BETWIN,
        choice: { mongo_name: "choice", sql_name: "choice", ...ColumnType.STR },
        refund: Columns.REFUND,
        totalWin: Columns.TOTALWIN,
        win: { mongo_name: "win", sql_name: "win", ...ColumnType.BOOL },

        stake: Columns.STAKE,
        payout: Columns.PAYOUT,

        ...Object.fromEntries(options.map((o) => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT }])),
    }) as BIColumn[],
});

const txturboTables = [Rounds, Bets, BetLogs];
export default txturboTables;
