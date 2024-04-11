import { BIColumn, BITable, ColumnType } from "@ldb/mongobi-helper";
import Columns from "../../common/columns";
import { columnsBase, pipelineBase } from "../templates/game-base";

const baseName = "vipsediewar";
const options = [
    "player",
    "banker",
    "tie",
    "even",
    "odd",
    "playerEven",
    "playerOdd",
    "playerRed3",
    "playerWhite3",
    "playerRed4",
    "playerWhite4",
    "bankerEven",
    "bankerOdd",
    "bankerRed3",
    "bankerWhite3",
    "bankerRed4",
    "bankerWhite4",
];

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

                betwin: 1,

                stake: "$totalAmount",
                payout: "$betwin",
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.gameBet,

        betwin: Columns.BETWIN,

        stake: Columns.STAKE,
        payout: Columns.PAYOUT,
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
                choice: 1,

                stake: { $multiply: [{ $add: options.map((o) => `$${o}`) }, { $toInt: { $not: "$freeBet" } }] },
                payout: "$betwin",

                ...Object.fromEntries(options.map((o) => [o, { $cond: [{ $eq: ["$choice", o] }, "$amount", 0] }])),
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.gameBetLog,

        amount: Columns.AMOUNT,
        choice: { mongo_name: "choice", sql_name: "choice", ...ColumnType.STR },

        stake: Columns.STAKE,
        payout: Columns.PAYOUT,

        ...Object.fromEntries(options.map((o) => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT }])),
    }) as BIColumn[],
});

const vipsediewarTables = [Rounds, Bets, BetLogs];
export default vipsediewarTables;
