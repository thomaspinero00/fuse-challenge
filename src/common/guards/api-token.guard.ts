import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-api-key'];

    const validToken = this.configService.get<string>('API_TOKEN');

    if (!token || token !== validToken) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
