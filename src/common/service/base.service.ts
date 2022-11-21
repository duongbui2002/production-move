import {
  FilterQuery,

  QueryOptions,
  Document, HydratedDocument, UnpackedIntersection,
  PaginateModel,
  PaginateOptions,
  QueryWithHelpers,


} from "mongoose";
import {HttpException} from "@nestjs/common";

export class BaseService<T extends Document> {
  constructor(private model: PaginateModel<T>) {
  }

  async create(createDocumentDto: any, options?: PaginateOptions): Promise<T> {
    const document = await this.model.create(createDocumentDto);
    if (options.populate) await document.populate(options.populate);
    return document;
  }

  async findAll(filter: FilterQuery<Document>, options?: PaginateOptions): Promise<PaginatedDocumentsResponse<T>> {
    const paginateResult = await this.model.paginate(filter, options);
    const data = paginateResult.docs;
    delete paginateResult.docs;
    return {
      data,
      paginationOptions: paginateResult
    };
  }

  async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<UnpackedIntersection<HydratedDocument<T, {}, {}>, {}>> {
    const document = await this.model.findOne(filter, null, options).populate(options?.populate).select(options?.select);
    if (options?.nullable !== true && !document) throw new HttpException(`${this.model.modelName} not found`, 500);

    return document;
  }

  async update(filter: FilterQuery<T>, updateDocumentDto: any, options?: QueryOptions): Promise<UnpackedIntersection<HydratedDocument<T, {}, {}>, {}>> {
    const document = await this.model.findOneAndUpdate(filter, updateDocumentDto, options).populate(options?.populate);
    if (options?.nullable !== true && !document) throw new HttpException(`${this.model.modelName} not found`, 500);

    return document;
  }

  async remove(filter: FilterQuery<T>, options?: QueryOptions): Promise<UnpackedIntersection<HydratedDocument<T, {}, {}>, {}>> {
    const document = await this.model.findOneAndDelete(filter, options).populate(options?.populate);
    if (options?.nullable !== true && !document) throw new HttpException(`${this.model.modelName} not found`, 500);

    return document;
  }

  count(filter: FilterQuery<T>): QueryWithHelpers<number, HydratedDocument<T, {}, {}>, {}, T> {
    return this.model.countDocuments(filter);
  }
}
