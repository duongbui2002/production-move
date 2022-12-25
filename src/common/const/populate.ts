import {PopulateOptions} from "mongoose";

export const productPopulate: PopulateOptions[] = [{
  model: 'Factory',
  path: 'producedBy',

}, {
  model: 'DistributionAgent',
  path: 'distributedBy',

}, {
  model: 'Warehouse',
  path: 'belongToWarehouse',

}, {
  model: 'ProductLine',
  path: 'productLine',
}, {
  path: 'order',
  populate: [{path: 'customer'}]
}]

export const warrantyPopulate: PopulateOptions[] = [{
  path: 'fromDistributionAgent',
  select: 'name address phoneNumber'
}, {
  path: 'products',
  populate: [{path: 'productLine'}]
}, {
  path: 'customer',
  select: 'name address phoneNumber'
}, {path: 'warrantyCenter', select: 'name address phoneNumber'},]