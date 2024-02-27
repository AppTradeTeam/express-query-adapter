import { FindOptionsUtils, LessThanOrEqual, Not } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { getParsedPrimitiveValue } from '../utils';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class LowerThanOrEqualLookup extends LookupBuilder {
  build(
    prop: string,
    value: string,
    notOperator?: boolean
  ): Record<string, FindOptionsUtils> {
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      const query = { $lte: getParsedPrimitiveValue(value) };
      return { [prop]: notOperator ? { $not: query } : query };
    } else {
      const query = LessThanOrEqual(value);
      return { [prop]: notOperator ? Not(query) : query };
    }
  }
}
