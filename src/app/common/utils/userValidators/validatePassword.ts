import { PASSWORD_REGEX } from '@constants/regex.constants';

import { RuleObject } from 'antd/es/form';

const validatePatternPassword = (fieldName: string) => (_: RuleObject, value: string) => {
    if (value && !PASSWORD_REGEX.test(value)) {
        return Promise.reject(
            new Error(`${fieldName} не може містити кирилицю`),
        );
    }
    return Promise.resolve();
};

export default validatePatternPassword;
