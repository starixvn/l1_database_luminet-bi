import { BIDatabase } from '@ldb/mongobi-helper';

const logDB = new BIDatabase({ name: 'log', tables: [] });

export default logDB;
