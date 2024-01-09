import { FindOptionsUtils } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { escapeRegExp } from '../utils';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class RegexLookup extends LookupBuilder {
  build(prop: string, value: string): Record<string, FindOptionsUtils> {
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      return { [prop]: { $regex: new RegExp(`${escapeRegExp(value)}`) } };
    } else if (this.dialect === TypeORMQueryDialect.POSTGRESQL) {
      return { [prop]: `~ ${value}` };
    } else {
      return { [prop]: `REGEXP ${value}` };
    }
  }
}

