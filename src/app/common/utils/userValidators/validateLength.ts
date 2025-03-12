import { RuleObject } from 'antd/es/form';

const validateLength = (minLength: number, maxLength: number) => (_: RuleObject, value: string) => {
    if (value && (value.length < minLength || value.length > maxLength)) {
        return Promise.reject(new Error(`Поле повинно містити від ${minLength} до ${maxLength} символів.`));
    }
    return Promise.resolve();
};

export default validateLength;
