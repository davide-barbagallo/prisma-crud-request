export type QueryOrderByOperator = 'asc' | 'desc';
export type QueryOrderBy = { [key: string]: QueryOrderByOperator };

export type QueryField = string;
export type QueryFields = QueryField[];

export type QueryFilterCondition = {
  field: string;
  operator: ComparisonOperator;
  value?: any;
};

export type QueryFilterLogical = {
  field?: never;
  operator: LogicalOperator;
  value: QueryFilter[];
};

export type QueryFilterNotLogical = {
  field?: never;
  operator: NotLogicalOperator;
  value: QueryFilter;
};

export type QueryFilter = QueryFilterCondition | QueryFilterLogical | QueryFilterNotLogical;

export type QueryJoin = {
  field: string;
  select?: QueryFields;
};

export enum ConditionalOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not',
  GREATER_THAN = 'gt',
  LOWER_THAN = 'lt',
  GREATER_THAN_EQUALS = 'gte',
  LOWER_THAN_EQUALS = 'lte',
  STARTS = 'startsWith',
  ENDS = 'endsWith',
  CONTAINS = 'contains',
  CONTAINS_LOW = 'contains',
  IN = 'in',
  NOT_IN = 'notIn',
}

export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR',
}

export enum NotLogicalOperator {
  NOT = 'NOT',
}

export type ComparisonOperator = ConditionalOperator;
