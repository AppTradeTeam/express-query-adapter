import { FindOptionsUtils } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { getParsedPrimitiveValue } from '../utils';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class HasLookup extends LookupBuilder {
  build(
    prop: string,
    value: string,
    notOperator?: boolean
  ): Record<string, FindOptionsUtils> {
    const values = value.split(',');
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      return {
        [notOperator ? '$nor' : '$or']: [
          { $and: values.map((v) => ({ [prop]: v })) },
          { $and: values.map((v) => ({ [prop]: getParsedPrimitiveValue(v) })) },
        ],
      };
    } else {
      throw new Error('Unsupported lookup for provided dialect.');
    }
  }
}
