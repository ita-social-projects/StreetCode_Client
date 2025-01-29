import { NAME_SURNAME_REGEX } from '@constants/regex.constants';

import { RuleObject } from 'antd/es/form';

const validatePatternNameSurname = (fieldName: string) => (_: RuleObject, value: string) => {
    if (value && !NAME_SURNAME_REGEX.test(value)) {
        return Promise.reject(
            new Error(`${fieldName} може містити лише літери латиниці 
            або кирилиці (великі та малі), дефіс (-) і апостроф (').`),
        );
    }
    return Promise.resolve();
};

export default validatePatternNameSurname;
