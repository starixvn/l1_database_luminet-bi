import { BIDatabase } from '@ldb/mongobi-helper';

const memberDB = new BIDatabase({ name: 'member', tables: [] });

export default memberDB;
