import { FindOptionsUtils, ILike, Not } from 'typeorm';
import { LookupBuilder } from '../lookup';
import { escapeRegExp } from '../utils';
import { TypeORMQueryDialect } from '../../../query-dialect';

export class InsensitiveEndsWithLookup extends LookupBuilder {
  build(
    prop: string,
    value: string,
    notOperator?: boolean
  ): Record<string, FindOptionsUtils> {
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      const query = {
        [prop]: { $regex: new RegExp(`${escapeRegExp(value)}$`, 'i') },
      };
      return notOperator ? { $not: query } : query;
    } else {
      const query = ILike(`%${value}`);
      return { [prop]: notOperator ? Not(query) : query };
    }
  }
}
