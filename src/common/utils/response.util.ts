import { ApiResponse, PaginationMeta } from '../../shared/interfaces/api-response.interface';

export class ResponseUtil {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static successWithPagination<T>(
    data: T[],
    meta: PaginationMeta,
    message?: string,
  ): ApiResponse<T[]> {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static error(message: string): ApiResponse<null> {
    return {
      success: false,
      message,
      data: null,
    };
  }
}
