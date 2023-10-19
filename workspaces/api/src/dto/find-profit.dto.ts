import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';
import { TimeRangeDTO } from './time-range.dto';

export class FindProfitDTO extends TimeRangeDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  readonly investAmount?: number;
}
