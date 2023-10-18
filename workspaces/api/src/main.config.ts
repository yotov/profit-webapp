import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const globalPipes = new ValidationPipe({
  transform: true,
  exceptionFactory: (errors) => {
    return new BadRequestException({
      message: "Your request parameters didn't validate.",
      fields: errors.reduce(
        (acc, e) => ({
          ...acc,
          [e.property]: Object.values(e.constraints).pop(),
        }),
        {},
      ),
    });
  },
});
