import { Type } from 'class-transformer';
import { IsNotEmpty, Validate } from 'class-validator';
import { EndLaterThanStartRule } from '../validator/end-later-than-start-rule';

export class TimeRangeDTO {
  @IsNotEmpty()
  @Type(() => Date)
  readonly startTime: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @Validate(EndLaterThanStartRule)
  readonly endTime: Date;
}
