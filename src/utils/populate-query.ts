import {PopulateOptions} from "mongoose";

export const autoPopulate = (additionalPopulateQuery?: PopulateOptions | (PopulateOptions | string)[]) => function (next) {
  let populateQuery: PopulateOptions | (PopulateOptions | string)[] = [];
  (additionalPopulateQuery && !Array.isArray(additionalPopulateQuery)) ? populateQuery.push(additionalPopulateQuery) : populateQuery.concat(additionalPopulateQuery);
  this.populate(populateQuery);
  next();
};
