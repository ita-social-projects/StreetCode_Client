import { PASSWORD_REGEX } from '@constants/regex.constants';

import { RuleObject } from 'antd/es/form';

const validatePatternPassword = () => (_: RuleObject, value: string) => {
    if (value && !PASSWORD_REGEX.test(value)) {
        return Promise.reject(
            new Error('Пароль повинен містити лише латинські літери.'),
        );
    }
    return Promise.resolve();
};

export default validatePatternPassword;
