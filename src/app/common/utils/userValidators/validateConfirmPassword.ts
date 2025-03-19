// eslint-disable-next-line import/no-extraneous-dependencies
import { RuleObject } from 'rc-field-form/lib/interface';

const validateConfirmPassword = (password: string) => (_: RuleObject, value: string) => {
    if (!value || value === password) {
        return Promise.resolve();
    }
    return Promise.reject(new Error('Паролі не збігаються'));
};

export default validateConfirmPassword;
