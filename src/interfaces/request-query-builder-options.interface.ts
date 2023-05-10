export interface RequestQueryBuilderOptions {
  delim?: string;
  delimStr?: string;
  paramNamesMap?: {
    where?: string | string[];
    joins?: string | string[];
    select?: string | string[];
    orderBy?: string | string[];
    page?: string | string[];
    pageSize?: string | string[];
  };
}
