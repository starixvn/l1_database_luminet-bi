import { BIDatabase } from '@ldb/mongobi-helper';
import commonTables              from './common';
import taixiuTables              from './games/01-A-taixiu';
import xocxocTables              from './games/02-B-xocxoc';
import baucuaTables              from './games/03-B-baucua';
import txturboTables             from './games/04-A-txturbo';
import chanleturboTables         from './games/06-A-chanleturbo';
import minidragontigerTables     from './games/07-B-minidragontiger';
import kenopromaxTables          from './games/08-B-kenopromax';
import minisedieTables           from './games/09-B-minisedie';
import baccaratTables            from './games/10-B-baccarat';
import kenominiTables            from './games/14-C-kenomini';
import kenomini2Tables           from './games/15-C-kenomini2';
import kenoeastTables            from './games/16-C-kenoeast';
import kenowestTables            from './games/17-C-kenowest';
import kenosouthTables           from './games/18-C-kenosouth';
import kenonorthTables           from './games/19-C-kenonorth';
import rouletteTables            from './games/20-D-roulette';
import vipsedieTables            from './games/21-B-vipsedie';
import blackjackTables           from './games/22-E-blackjack';
import specialsedieTables        from './games/24-A-specialsedie';
import sicboTables               from './games/25-C-sicbo';
import vipfishprawncrabTables    from './games/26-B-vipfishprawncrab';
import vipbaccaratTables         from './games/27-B-vipbaccarat';
import vipsediewarTables         from './games/28-C-vipsediewar';
import fourguardiansTables       from './games/29-F-fourguardians';
import lotteryTables             from './games/31-G-lottery';
import threecardsTables          from './games/35-B-threecards';
import kenomatch1Tables          from './games/36-H-kenomatch1';
import kenomatch2Tables          from './games/37-H-kenomatch2';
import heroesslotTables          from './games/38-F-heroesslot';
import casinoholdempokerTables   from './games/39-J-casinoholdempoker';
import kenopower1Tables          from './games/40-I-kenopower1';
import kenopower2Tables          from './games/41-I-kenopower2';
import texasholdempokerTables    from './games/42-J-texasholdempoker';
import bitcoinmasterTables       from './games/43-K-bitcoinmaster';
import hiloTables                from './games/45-L-hilo';
import nightclubTables           from './games/46-F-nightclub';
import treasureislandTables      from './games/47-M-treasureisland';
import blockchainbaccaratTables  from './games/48-B-blockchainbaccarat';
import waytogoalTables           from './games/49-F-waytogoal';
import unbalancedbigsmall1Tables from './games/50-C-unbalancedbigsmall1';
import unbalancedbigsmall2Tables from './games/51-C-unbalancedbigsmall2';
import megakenoTables            from './games/52-N-megakeno';
import megakeno2Tables           from './games/53-N-megakeno2';
import unbalancedbigsmall3Tables from './games/54-C-unbalancedbigsmall3';
import unbalancedbigsmall4Tables from './games/55-C-unbalancedbigsmall4';
import minisedie2Tables          from './games/56-O-minisedie2';
import minisedie3Tables          from './games/57-O-minisedie3';
import minisedie4Tables          from './games/58-O-minisedie4';
import fruitslotTables           from './games/59-I-fruitslot';

export const minigameDB = new BIDatabase({
  name  : 'minigame',
  tables: [
    ...commonTables,
    ...taixiuTables,
    ...xocxocTables,
    ...baucuaTables,
    ...txturboTables,
    ...chanleturboTables,
    ...minidragontigerTables,
    ...kenopromaxTables,
    ...minisedieTables,
    ...baccaratTables,
    ...kenominiTables,
    ...kenomini2Tables,
    ...kenoeastTables,
    ...kenowestTables,
    ...kenosouthTables,
    ...kenonorthTables,
    ...rouletteTables,
    ...vipsedieTables,
    ...blackjackTables,
    ...specialsedieTables,
    ...sicboTables,
    ...vipfishprawncrabTables,
    ...vipbaccaratTables,
    ...vipsediewarTables,
    ...fourguardiansTables,
    ...lotteryTables,
    ...threecardsTables,
    ...kenomatch1Tables,
    ...kenomatch2Tables,
    ...heroesslotTables,
    ...casinoholdempokerTables,
    ...kenopower1Tables,
    ...kenopower2Tables,
    ...texasholdempokerTables,
    ...bitcoinmasterTables,
    ...hiloTables,
    ...nightclubTables,
    ...treasureislandTables,
    ...blockchainbaccaratTables,
    ...waytogoalTables,
    ...unbalancedbigsmall1Tables,
    ...unbalancedbigsmall2Tables,
    ...megakenoTables,
    ...megakeno2Tables,
    ...unbalancedbigsmall3Tables,
    ...unbalancedbigsmall4Tables,
    ...minisedie2Tables,
    ...minisedie3Tables,
    ...minisedie4Tables,
    ...fruitslotTables,
  ],
});

export default minigameDB;
