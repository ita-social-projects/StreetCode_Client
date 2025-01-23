import { RuleObject } from 'antd/es/form';

const validateLength = (fieldName: string, minLength: number, maxLength: number) => (_: RuleObject, value: string) => {
    if (value && (value.length < minLength || value.length > maxLength)) {
        return Promise.reject(new Error(`${fieldName} повинно містити від ${minLength} до ${maxLength} символів.`));
    }
    return Promise.resolve();
};

export default validateLength;
