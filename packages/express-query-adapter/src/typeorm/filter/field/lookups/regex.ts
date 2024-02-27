import { FindOptionsUtils, Not } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class RegexLookup extends LookupBuilder {
  build(
    prop: string,
    value: string,
    notOperator?: boolean
  ): Record<string, FindOptionsUtils> {
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      const query = { $regex: new RegExp(`${value}`) };
      return { [prop]: notOperator ? { $not: query } : query };
    } else if (this.dialect === TypeORMQueryDialect.POSTGRES) {
      const query = `~ ${value}`;
      return { [prop]: notOperator ? Not(query) : query };
    } else {
      const query = `REGEXP ${value}`;
      return { [prop]: notOperator ? Not(query) : query };
    }
  }
}
