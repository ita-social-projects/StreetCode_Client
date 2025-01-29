import { EMAIL_REGEX } from '@constants/regex.constants';

const validateEmail = (_: any, value: string) => {
    if (!value || EMAIL_REGEX.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject(new Error('Введіть коректну електронну пошту'));
};

export default validateEmail;
