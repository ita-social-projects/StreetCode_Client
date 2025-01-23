import { RuleObject } from 'antd/es/form';

const validatePatternNameSurname = (fieldName: string) => (_: RuleObject, value: string) => {
    const pattern = /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ'-]+$/;
    if (value && !pattern.test(value)) {
        return Promise.reject(
            new Error(`${fieldName} може містити лише літери латиниці 
            або кирилиці (великі та малі), дефіс (-) і апостроф (').`),
        );
    }
    return Promise.resolve();
};

export default validatePatternNameSurname;
