import { USERNAME_REGEX } from '@constants/regex.constants';

import { RuleObject } from 'antd/es/form';

const validatePatternUserName = (fieldName: string) => (_: RuleObject, value: string) => {
    if (value && !USERNAME_REGEX.test(value)) {
        return Promise.reject(
            new Error(`${fieldName} може містити лише літери латиниці 
            (малі), цифри та спец. символи`),
        );
    }
    return Promise.resolve();
};

export default validatePatternUserName;
