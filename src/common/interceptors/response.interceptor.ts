import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Error) {
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: data.message,
            data: null,
          };
        } else {
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: 'OK',
            data,
          };
        }
      }),
    );
  }
}
