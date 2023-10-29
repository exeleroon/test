/**
 * Use markers for messages:
 * - @fieldName - will be replaced with field name
 *
 */
export class BaseValidator {
    message: string = '@fieldName is required';

    constructor(message: string = '') {
        if (message) {
            this.message = message;
        }
    }

    isValid(value: any): boolean {
        return false;
    }

    getMessage(fieldName: string) {
        fieldName = fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);

        return this.message
            .replace('@fieldName', fieldName);
    }
}