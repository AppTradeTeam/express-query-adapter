import { TypeORMQuery } from '../../query';
import { ExpressQuery } from '../../../express-query';
import { ConfigProfile } from '../../../profile/config-profile';
import { TypeORMQueryDialect } from '../../query-dialect';

export interface FilterOptionQuery {
  source: ExpressQuery;
  target: TypeORMQuery;
  dialect: TypeORMQueryDialect
}

export interface FilterOption {
  setOption(query: FilterOptionQuery, profile: ConfigProfile, dialect?: TypeORMQueryDialect): void;
  isAuthorized(profile: ConfigProfile): boolean;
}
