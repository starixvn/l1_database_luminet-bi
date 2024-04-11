import { BIColumn, BITable, ColumnType } from "@ldb/mongobi-helper";
import Columns from "../../common/columns";
import { columnsBase, pipelineBase } from "../templates/game-base";

const baseName = "blockchainbaccarat";
const options = ["player", "banker", "big", "small", "tie", "playerPair", "bankerPair"];

/** rounds */
const Rounds = new BITable({
    mongo_name: `${baseName}_rounds`,
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
    mongo_name: `${baseName}_bets`,
    sql_name: `${baseName}_bets`,
    pipeline: [
        { $match: { $or: [{ playerId: { $gt: 0 } }, { playerId: { $gt: "" } }] } },
        {
            $project: {
                _id: 0,
                ...pipelineBase.gameBet,

                betwin: 1,

                stake: { $multiply: [{ $add: options.map((o) => `$${o}`) }, { $toInt: { $not: "$freeBet" } }] },
                payout: "$betwin",

                ...Object.fromEntries(options.map((o) => [o, 1])),
            },
        },
    ],
    columns: Object.values({
        ...columnsBase.gameBet,

        betwin: Columns.BETWIN,

        stake: Columns.STAKE,
        payout: Columns.PAYOUT,

        ...Object.fromEntries(options.map((o) => [o, { mongo_name: o, sql_name: o, ...ColumnType.FLOAT }])),
    }) as BIColumn[],
});

const blockchainbaccaratTables = [Rounds, Bets];
export default blockchainbaccaratTables;
