import { BIDatabase } from '@ldb/mongobi-helper';
import betSummariesTables from './summaries/bet-summaries';

const summaryDB = new BIDatabase({ name: 'summary', tables: [
  ...betSummariesTables,
] });

export default summaryDB;
