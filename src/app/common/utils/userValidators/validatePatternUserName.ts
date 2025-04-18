import { USERNAME_REGEX } from '@constants/regex.constants';

import { RuleObject } from 'antd/es/form';

const validatePatternUserName = () => (_: RuleObject, value: string) => {
    if (value && !USERNAME_REGEX.test(value)) {
        return Promise.reject(
            new Error('Дозволені лише літери, пробіли, дефіси (-) та апострофи (\').'),
        );
    }
    return Promise.resolve();
};

export default validatePatternUserName;
