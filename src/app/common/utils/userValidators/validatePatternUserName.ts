import { RuleObject } from 'antd/es/form';

const validatePatternUserName = (fieldName: string) => (_: RuleObject, value: string) => {
    const pattern = /^[a-z0-9\-'_]+$/;
    if (value && !pattern.test(value)) {
        return Promise.reject(
            new Error(`${fieldName} може містити лише літери латиниці 
            (малі), цифри та спец. символи`),
        );
    }
    return Promise.resolve();
};

export default validatePatternUserName;
