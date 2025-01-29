import { EMAIL_REGEX } from '@constants/regex.constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RuleObject } from 'rc-field-form/lib/interface';

const validateEmail = (_: RuleObject, value: string) => {
    if (!value || EMAIL_REGEX.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject(new Error('Введіть коректну електронну пошту'));
};

export default validateEmail;
