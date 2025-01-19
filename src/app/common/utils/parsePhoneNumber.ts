import { PhoneNumber } from 'antd-phone-input';

export default function parsePhoneNumber(phoneNumber: PhoneNumber): string | null {
    if (!phoneNumber.phoneNumber) {
        return null;
    }
    return phoneNumber.countryCode
        ? `+${phoneNumber.countryCode ?? ''}${phoneNumber.areaCode ?? ''}${phoneNumber.phoneNumber ?? ''}` : null;
}
