import {BaseValidator} from "../forms/validators/BaseValidator";

export class BaseModel {
    static DEFAULT_SCOPE = 'default';
    hash: string = Math.random().toString();

    validators: {
        fieldName: string,
        validator: BaseValidator,
        scope: string
    }[] = [];

    validationMessages: {
        fieldName: string,
        message: string
    }[] = [];

    assign(data) {
        for (const [propName, value] of Object.entries(data)) {
            this.setProperty(propName, value);
        }
    }

    /**
     * Allow mapping date to custom field
     *
     * @param name
     * @param value
     * @returns {Base}
     */
    setProperty(name: string, value: any): this {
        let nameParts = name.split('_');

        name = nameParts.shift();

        nameParts.forEach((part) => {
            name += part[0].toUpperCase() + part.substr(1);
        });

        if (this[name] !== undefined) {
            this[name] = value;
        } else {
            // console.warn('Unknown property: ' + name);
        }

        return this;
    }

    /**
     * Clear object
     *
     * @returns {Base}
     */
    clean(): this {
        this.validationMessages = [];

        for (const [propName] of Object.entries(this)) {
            if (['validators', 'validationMessages'].indexOf(propName) !== -1) {
                continue;
            }

            this[propName] = null;
        }

        return this;
    }

    addValidator(fieldName: string, validator: BaseValidator, scope: string = ''): this {
        if (this[fieldName] === undefined) {
            throw new Error('Field not found: ' + fieldName);
        }

        if (!scope) {
            scope = BaseModel.DEFAULT_SCOPE;
        }

        this.validators.push({
            fieldName: fieldName,
            validator: validator,
            scope: scope
        });

        return this;
    }

    isValid(scope: string = ''): boolean {
        let result = true;
        this.validationMessages = [];

        this.validators.forEach(validatorItem => {
            if (scope && scope !== validatorItem.scope) {
                return;
            }

            if (!validatorItem.validator.isValid(this[validatorItem.fieldName])) {
                this.validationMessages.push({
                    fieldName: validatorItem.fieldName,
                    message: validatorItem.validator.getMessage(validatorItem.fieldName)
                });

                result = false;
            }
        });

        return result;
    }

    getFieldError(fieldName: string): string {
        if (this[fieldName] === undefined) {
            throw new Error('Field not found: ' + fieldName);
        }

        let result = '';

        this.validationMessages.some((item) => {
            if (item.fieldName === fieldName) {
                result = item.message;

                return true;
            }

            return false;
        });

        return result;
    }
}