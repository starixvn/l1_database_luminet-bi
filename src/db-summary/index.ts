import { BIDatabase } from '@ldb/mongobi-helper';
import gamesMetaTables    from './metadata/games-meta';
import betSummariesTables from './summaries/bet-summaries';

const summaryDB = new BIDatabase({ name: 'summary', tables: [
  ...betSummariesTables,
  ...gamesMetaTables,
] });

export default summaryDB;
