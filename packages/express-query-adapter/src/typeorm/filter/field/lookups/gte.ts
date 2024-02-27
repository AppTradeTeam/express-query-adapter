import { FindOptionsUtils, MoreThanOrEqual, Not } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { getParsedPrimitiveValue } from '../utils';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class GreaterThanOrEqualLookup extends LookupBuilder {
  build(
    prop: string,
    value: string,
    notOperator?: boolean
  ): Record<string, FindOptionsUtils> {
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      const query = { $gte: getParsedPrimitiveValue(value) };
      return { [prop]: notOperator ? { $not: query } : query };
    } else {
      const query = MoreThanOrEqual(value);
      return { [prop]: notOperator ? Not(query) : query };
    }
  }
}
