declare module "mongoose" {
  interface QueryOptions {
    select?: string;
    populate?: PopulateOptions | (PopulateOptions | string)[]
  }
}

interface PaginatedDocumentsResponse<T> {
  data: T[];
  paginationOptions: Partial<import ("mongoose").PaginateResult<T>>;
}