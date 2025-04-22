import { RuleObject } from 'antd/es/form';

const validateRequired = (fieldName: string) => (_: RuleObject, value: string) => {
    if (!value) {
        return Promise.reject(new Error(`Введіть ${fieldName}`));
    }
    return Promise.resolve();
};

export default validateRequired;
