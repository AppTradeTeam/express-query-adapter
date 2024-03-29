import { FindOptionsUtils, In, Not } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { getParsedPrimitiveValue } from '../utils';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class InLookup extends LookupBuilder {
  build(
    prop: string,
    value: string,
    notOperator?: boolean
  ): Record<string, FindOptionsUtils> {
    const values = value.split(',');
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      return {
        [notOperator ? '$nor' : '$or']: [
          { [prop]: { $in: values } },
          { [prop]: { $in: values.map((v) => getParsedPrimitiveValue(v)) } },
        ],
      };
    } else {
      const query = In(values);
      return { [prop]: notOperator ? Not(query) : query };
    }
  }
}
