import { RuleObject } from 'rc-field-form/lib/interface';

import PartnersStore from '@/app/stores/partners-store';
import Partner from '@/models/partners/partners.model';

const partnerNameValidator = (
    _: RuleObject,
    value: string,
    partnersStore: PartnersStore,
    partnerItem: Partner | undefined,
): Promise<void> => {
    const isUnique = partnersStore.getPartnerArray.find(
        (x) => x.title === value.trimEnd(),
    ) === undefined;

    if (partnerItem && partnerItem.title === value.trimEnd()) {
        return Promise.resolve();
    }

    if (!isUnique) {
        return Promise.reject(new Error('Партнер уже існує.'));
    }

    return Promise.resolve();
};

export default partnerNameValidator;
