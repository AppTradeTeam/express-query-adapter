import { FindOptionsUtils, LessThan, Not } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { getParsedPrimitiveValue } from '../utils';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class LowerThanLookup extends LookupBuilder {
  build(
    prop: string,
    value: string,
    notOperator?: boolean
  ): Record<string, FindOptionsUtils> {
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      const query = { $lt: getParsedPrimitiveValue(value) };
      return { [prop]: notOperator ? { $not: query } : query };
    } else {
      const query = LessThan(value);
      return { [prop]: notOperator ? Not(query) : query };
    }
  }
}
