import { ICategory } from 'src/common';

export class CategoryResponse {
  catCategory: ICategory;
}

export class GetAllResponse {
  result: {
    docsCount?: number;
    limit?: number;
    pages?: number;
    currentPage?: number | undefined;
    result: ICategory[];
  };
}
