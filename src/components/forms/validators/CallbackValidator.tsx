import {BaseValidator} from "./BaseValidator";

export class CallbackValidator extends BaseValidator {
    callback: () => boolean;

    constructor(callback: () => boolean, message: string = '') {
        super(message);
        this.callback = callback;
    }

    isValid(value: any): boolean {
        // @ts-ignore
        return this.callback.call(this, value);
    }
}