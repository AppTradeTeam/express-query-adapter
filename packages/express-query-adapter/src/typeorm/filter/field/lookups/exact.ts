import { FindOptionsUtils, Not } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { getParsedPrimitiveValue } from '../utils';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class ExactLookup extends LookupBuilder {
  build(
    prop: string,
    value: string,
    notOperator?: boolean
  ): Record<string, FindOptionsUtils> {
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      return {
        [notOperator ? '$nor' : '$or']: [
          { [prop]: { $eq: value } },
          { [prop]: { $eq: getParsedPrimitiveValue(value) } },
        ],
      };
    } else {
      return { [prop]: notOperator ? Not(value) : value };
    }
  }
}
