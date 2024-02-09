import { LookupBuilderFactory } from './lookup-builder-factory';
import { FindOperator, Not, ObjectLiteral } from 'typeorm';
import { AbstractFilter } from '../filter';
import { LookupFilter } from './lookup.enum';
import { ExpressQuery } from '../../../express-query';
import { TypeORMQuery } from '../../query';
import { TypeORMQueryDialect } from '../../query-dialect';

interface FilterConfig {
  query: ExpressQuery;
  dialect?: TypeORMQueryDialect;
  prop: string;
  lookup: LookupFilter;
  value: string;
  notOperator?: boolean;
}

type FilterParam = FindOperator<unknown> | ObjectLiteral | FindOperator<Record<string, FindOperator<unknown> | ObjectLiteral>> 

interface NestedObject {
  [key: string]: FilterParam | NestedObject;
}

export class FieldFilter extends AbstractFilter {
  public readonly notOperator: boolean;
  private readonly lookupBuilderFactory: LookupBuilderFactory =
    new LookupBuilderFactory();

  constructor({
    query,
    prop,
    lookup,
    value,
    dialect,
    notOperator,
  }: FilterConfig) {
    super({ query, prop, lookup, value, dialect });
    this.notOperator = notOperator || false;
  }

  public buildQuery(): void {
    const queryToAdd = this.getQuery();
    this.setQuery(queryToAdd);
  }

  private setQuery(queryToAdd: TypeORMQuery) {
    if (this.dialect === TypeORMQueryDialect.MONGODB) {
      this.query['where'] = {
        $and: [...(this.query?.['where']?.['$and'] ?? []), queryToAdd],
      };
    } else {
      this.query['where'] = {
        ...this.query['where'],
        ...queryToAdd,
      };
    }
  }

  private getQuery(): TypeORMQuery {
    const builder = this.lookupBuilderFactory.build({
      lookup: this.lookup,
      dialect: this.dialect,
    });
    const queryToAdd = builder.build(this.prop, this.value);
    if (this.notOperator) {
      if (this.dialect === TypeORMQueryDialect.MONGODB) {
        if (queryToAdd['$or']) {
          // NOT (A OR B) = NOT A AND NOT B
          queryToAdd['$and'] = (queryToAdd['$or'] as ObjectLiteral[]).map(
            (q) => ({ [this.prop]: { $not: q[this.prop] } })
          );
          delete queryToAdd['$or'];
        } else {
          queryToAdd[this.prop] = { $not: queryToAdd[this.prop] };
        }
      } else {
        queryToAdd[this.prop] = Not(queryToAdd[this.prop]);
      }
    } if (this.dialect !== TypeORMQueryDialect.MONGODB) {
      // Handle nested fields for sql dialects
      const nestedFields = this.prop.split('.');
      if (nestedFields.length > 1) {
        const value = queryToAdd[this.prop]
        delete queryToAdd[this.prop]
        return this.constructNestedObject(nestedFields, value);
      }
    }

    return queryToAdd;
  }

  private constructNestedObject(nestedFields: string[], value: FilterParam): NestedObject {
    const construct = (fields: string[], value: FilterParam): NestedObject => {
      if (fields.length === 1) {
        return { [fields[0]]: value };
      }
      const [currentField, ...remainingFields] = fields;
      return { [currentField]: construct(remainingFields, value) };
    };
    return construct(nestedFields, value);
  }
}
