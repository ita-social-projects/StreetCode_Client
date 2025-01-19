import parsePhoneNumber from '@utils/parsePhoneNumber';
import { RuleObject } from 'rc-field-form/lib/interface';

import { PhoneNumber } from 'antd-phone-input';

export default function phoneNumberValidator(_: RuleObject, value: PhoneNumber) {
    const phoneNumber = parsePhoneNumber(value);
    const phoneNumberRegex = /^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$/;
    if (phoneNumber && !phoneNumberRegex.test(phoneNumber)) {
        return Promise.reject(
            new Error('Допустимий формат: +XXX XX XXX XX XX.'),
        );
    }
    return Promise.resolve();
}
