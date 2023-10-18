import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class EndLaterThanStartRule implements ValidatorConstraintInterface {
  validate(value: Date, args: ValidationArguments) {
    return value > args.object['startTime']; // @TODO: Allow startTime to be overriden
  }

  defaultMessage(): string {
    return 'endTime should be later than startTime'; // @TODO: do not hard core name of fields
  }
}
