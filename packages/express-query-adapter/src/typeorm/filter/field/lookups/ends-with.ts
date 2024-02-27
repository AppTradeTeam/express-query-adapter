import { FindOptionsUtils, Like, Not } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { escapeRegExp } from '../utils';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class EndsWithLookup extends LookupBuilder {
  build(
    prop: string,
    value: string,
    notOperator?: boolean
  ): Record<string, FindOptionsUtils> {
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      const query = { $regex: new RegExp(`${escapeRegExp(value)}$`) };
      return { [prop]: notOperator ? { $not: query } : query };
    } else {
      const query = Like(`%${value}`);
      return { [prop]: notOperator ? Not(query) : query };
    }
  }
}
