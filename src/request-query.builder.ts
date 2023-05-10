import { isNil, isObject, isString, isUndefined } from '@nestjsx/util';
import { CreateQueryParams, RequestQueryBuilderOptions } from './interfaces';
import { LogicalOperator, QueryField, QueryFields, QueryFilter, QueryOrderBy } from './types';

export class RequestQueryBuilder {
  private static _options: RequestQueryBuilderOptions = {
    delim: '||',
    delimStr: ',',
    paramNamesMap: {
      where: 'where',
      joins: 'joins',
      select: 'select',
      orderBy: 'orderBy',
      page: 'page',
      pageSize: 'pageSize',
    },
  };

  public queryObject: { [key: string]: any } = {};

  public queryString: string;

  private paramNames: {
    [key in keyof RequestQueryBuilderOptions['paramNamesMap']]: string;
  } = {};

  constructor() {
    this.setParamNames();
  }

  static setOptions(options: RequestQueryBuilderOptions) {
    RequestQueryBuilder._options = {
      ...RequestQueryBuilder._options,
      ...options,
      paramNamesMap: {
        ...RequestQueryBuilder._options.paramNamesMap,
        ...(options.paramNamesMap ? options.paramNamesMap : {}),
      },
    };
  }

  static getOptions(): RequestQueryBuilderOptions {
    return RequestQueryBuilder._options;
  }

  static create(params?: CreateQueryParams): RequestQueryBuilder {
    const qb = new RequestQueryBuilder();
    return isObject(params) ? qb.createFromParams(params) : qb;
  }

  get options(): RequestQueryBuilderOptions {
    return RequestQueryBuilder._options;
  }

  setParamNames() {
    Object.keys(RequestQueryBuilder._options.paramNamesMap).forEach(key => {
      const name = RequestQueryBuilder._options.paramNamesMap[key];
      this.paramNames[key] = isString(name) ? (name as string) : (name[0] as string);
    });
  }

  select(include: QueryFields, exclude: QueryFields): this {
    this.setInclude(include);
    this.setExclude(exclude);
    return this;
  }

  setInclude(fields: QueryFields) {
    const param = this.checkQueryObjectParam('select', {});
    this.queryObject[param] = {
      ...this.queryObject[param],
      only: fields,
    };
    return this;
  }

  setExclude(fields: QueryFields) {
    const param = this.checkQueryObjectParam('select', {});
    this.queryObject[param] = {
      ...this.queryObject[param],
      except: fields,
    };
    return this;
  }

  setWhere(condition: QueryFilter | QueryFilter[]): this {
    if (!isNil(condition)) {
      const param = this.checkQueryObjectParam('where', {});
      this.queryObject[param] = this.formatCondition(condition);
    }
    return this;
  }

  setJoin(j: QueryField | QueryFields): this {
    if (!isNil(j)) {
      const param = this.checkQueryObjectParam('joins', []);
      const nextElement = Array.isArray(j) ? j : [j];
      this.queryObject[param] = [...this.queryObject[param], ...nextElement];
    }
    return this;
  }

  sortBy(s: QueryOrderBy | QueryOrderBy[]): this {
    if (!isNil(s)) {
      const nextSorts = Array.isArray(s) ? s : [s];
      const param = this.checkQueryObjectParam('orderBy', []);
      this.queryObject[param] = [...this.queryObject[param], ...nextSorts];
    }
    return this;
  }

  setPage(n: number): this {
    this.setNumeric(n, 'page');
    return this;
  }

  setPageSize(n: number): this {
    this.setNumeric(n, 'pageSize');
    return this;
  }

  private createFromParams(params: CreateQueryParams): this {
    this.select(params.includeFields, params.excludeFields);
    this.setWhere(params.where);
    this.setJoin(params.joins);
    this.setPage(params.page);
    this.setPageSize(params.pageSize);
    this.sortBy(params.orderBy);
    return this;
  }

  private formatCondition(query: QueryFilter | QueryFilter[]): QueryFilter {
    if (Array.isArray(query)) {
      return {
        operator: LogicalOperator.AND,
        value: query,
      };
    }
    return query;
  }

  private creteQuery(where: QueryFilter) {
    if (where.operator === 'OR' || where.operator === 'AND') {
      return { [where.operator]: where.value.map(nestedWhere => this.creteQuery(where)) };
    } else if (where.operator === 'NOT') {
      return { [where.operator]: this.creteQuery(where) };
    } else {
      return {
        [where.field]: {
          [where.operator]: where.value,
        },
      };
    }
  }

  private checkQueryObjectParam(
    cond: keyof RequestQueryBuilderOptions['paramNamesMap'],
    defaults: any,
  ): string {
    const param = this.paramNames[cond];
    if (isNil(this.queryObject[param]) && !isUndefined(defaults)) {
      this.queryObject[param] = defaults;
    }
    return param;
  }

  private setNumeric(n: number, cond: 'page' | 'pageSize'): void {
    if (!isNil(n)) {
      this.queryObject[this.paramNames[cond]] = n;
    }
  }
}
