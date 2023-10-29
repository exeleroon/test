import {BaseValidator} from "./BaseValidator";

export class NotEmptyValidator extends BaseValidator {
    constructor(message: string = '') {
        if (!message) {
            message = '@fieldName is required';
        }

        super(message);
    }

    isValid(value: any): boolean {
        if (!value || value === undefined || value === '' || value === null) {
            return false;
        }

        // console.log(['validate', value]);

        if (typeof value === 'string') {
            // console.log(['validateString', value.replaceAll(' ', '')]);
            return value.replaceAll(' ', '') !== '';
        }

        return true;
    }
}