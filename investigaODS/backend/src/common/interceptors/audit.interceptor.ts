import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId: number | undefined = request?.user?.id;
    const action = `${request.method} ${request.route?.path ?? request.url}`;
    const metadata = {
      body: request.body,
      params: request.params,
      query: request.query,
    };

    return next.handle().pipe(
      tap(() => {
        if (request.route) {
          this.auditService
            .record(action, metadata, userId)
            .catch(() => undefined);
        }
      }),
    );
  }
}
