import parsePhoneNumber from '@utils/parsePhoneNumber';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RuleObject } from 'rc-field-form/lib/interface';

import { PhoneNumber } from 'antd-phone-input';

export default function phoneNumberValidator(_: RuleObject, value: PhoneNumber) {
    const phoneNumber = parsePhoneNumber(value);
    const phoneNumberRegex = /(?=.*\+[0-9]{3}\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{4,5}$)/;
    if (phoneNumber && !phoneNumberRegex.test(phoneNumber)) {
        return Promise.reject(
            new Error('Допустимий формат: +XXX XX XXX XX XX.'),
        );
    }
    return Promise.resolve();
}
