import { ConfigProfile } from '../../../profile/config-profile';
import { TypeORMQueryDialect } from '../../query-dialect';
import { FilterOption, FilterOptionQuery } from './filter-option';

interface NestedObject {
  [key: string]: string | NestedObject;
}


export class OrderOption implements FilterOption {
  public setOption(query: FilterOptionQuery, profile: ConfigProfile, dialect: TypeORMQueryDialect): void {
    if (!this.isAuthorized(profile)) {
      delete query.source['order'];
      return;
    }
    if (!query.source['order']) {
      return;
    }

    const orderFields = query.source['order'].split(',');

    if (dialect === TypeORMQueryDialect.MONGODB) {
      for (const field of orderFields) {
        const orderCriteria = this.getOrderCriteria(field);
        query.target['order'] = {
          ...query.target['order'],
          [field.substr(1, field.length)]: orderCriteria,
        };
      }
      delete query.source['order'];
    } else {
      let orderObject = {};
      for (const field of orderFields) {
        const orderCriteria = this.getOrderCriteria(field);
        const nestedFields = field.split('.');
        nestedFields[0] = nestedFields[0].substr(1, nestedFields[0].length)
        const nestedObj = this.constructNestedObject(nestedFields, orderCriteria);
        orderObject = {...orderObject,...nestedObj}
      }
      query.target['order'] = { ...query.target['order'], ...orderObject };
      delete query.source['order'];
    }
  }

  private getOrderCriteria(field: string): string {
    if (field.startsWith('+')) {
      return 'ASC';
    } else if (field.startsWith('-')) {
      return 'DESC';
    } else {
      throw new Error(
        `No order set for <${field}>. Prefix with one of these: [+, -]`
      );
    }
  }

  private constructNestedObject(nestedFields: string[], value: string): NestedObject {
    const construct = (fields: string[], value: string): NestedObject => {
      if (fields.length === 1) {
        return { [fields[0]]: value };
      }
      const [currentField, ...remainingFields] = fields;
      return { [currentField]: construct(remainingFields, value) };
    };
    return construct(nestedFields, value);
  }

  public isAuthorized(profile: ConfigProfile): boolean {
    if (profile.options.ordering.status === 'disabled') {
      return false;
    }
    return true;
  }
}
