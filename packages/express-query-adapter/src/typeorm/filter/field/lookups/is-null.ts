import { FindOptionsUtils, IsNull, Not } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class IsNullLookup extends LookupBuilder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  build(
    prop: string,
    value: string,
    notOperator?: boolean
  ): Record<string, FindOptionsUtils> {
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      const query = { $eq: null };
      return { [prop]: notOperator ? { $not: query } : query };
    } else {
      const query = IsNull();
      return { [prop]: notOperator ? Not(query) : query };
    }
  }
}
