import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<unknown>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        const message = this.getMessageForStatusCode(statusCode);

        return {
          statusCode,
          message,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  private getMessageForStatusCode(statusCode: number): string {
    const messages: Record<number, string> = {
      200: 'Request successful',
      201: 'Resource created successfully',
      204: 'No content',
      400: 'Bad request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not found',
      409: 'Conflict',
      422: 'Unprocessable entity',
      500: 'Internal server error',
    };

    return messages[statusCode] || 'Success';
  }
}
