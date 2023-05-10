import { QueryFields, QueryFilter, QueryOrderBy } from '../types';

export interface CreateQueryParams {
  where?: QueryFilter | QueryFilter[];
  joins?: QueryFields;
  includeFields?: QueryFields;
  excludeFields?: QueryFields;
  orderBy?: QueryOrderBy[];
  page?: number;
  pageSize?: number;
}
