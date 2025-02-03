import { Validate } from "class-validator";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isCustomJSON', async: false })
export class IsCustomJSON implements ValidatorConstraintInterface {
    validate(text: string, _: ValidationArguments) {
        try {
            JSON.parse(text);
            return true;
        } catch (e) {
            return false;
        }
    }

    defaultMessage(_: ValidationArguments) {
        return 'Text ($value) is not a valid JSON string!';
    }
}

export class UpdateConfigDTO {
    @Validate(IsCustomJSON)
    data: string;
}
