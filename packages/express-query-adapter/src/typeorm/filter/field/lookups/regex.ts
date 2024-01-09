import { FindOptionsUtils } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class RegexLookup extends LookupBuilder {
  build(prop: string, value: string): Record<string, FindOptionsUtils> {
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      return { [prop]: { $regex: new RegExp(`${value}`) } };
    } else if (this.dialect === TypeORMQueryDialect.POSTGRES) {
      return { [prop]: `~ ${value}` };
    } else {
      return { [prop]: `REGEXP ${value}` };
    }
  }
}

