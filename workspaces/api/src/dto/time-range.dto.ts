import { Type } from 'class-transformer';
import { IsNotEmpty, Validate } from 'class-validator';
import { isAfterThan } from '../validator/is-after-than';

export class TimeRangeDTO {
  @IsNotEmpty()
  @Type(() => Date)
  readonly startTime: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @isAfterThan('startTime')
  readonly endTime: Date;
}
