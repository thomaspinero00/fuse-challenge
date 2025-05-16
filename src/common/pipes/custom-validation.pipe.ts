import {
  BadRequestException,
  Injectable,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { parseErrorMessageDTO } from '../utils/parse-error-from-dto';

@Injectable()
export class CustomValidationDTO extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          message: parseErrorMessageDTO(error),
        }));
        throw new BadRequestException({ message: 'Validation failed', errors: formattedErrors });
      },
    } as ValidationPipeOptions);
  }
}
