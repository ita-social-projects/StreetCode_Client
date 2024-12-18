import React, { useEffect, useState } from 'react';
import { ModelState } from '@models/enums/model-state';
import PartnersStore from '@stores/partners-store';

import { Button, Select } from 'antd';

import SelectWithCustomSuffix from '@/app/common/components/SelectWithCustomSuffix';
import PartnerModal from '@/features/AdminPage/PartnersPage/PartnerModal/PartnerModal.component';
import Partner, { PartnerCreateUpdateShort, PartnerShort } from '@/models/partners/partners.model';

interface Props {
    partners: PartnerCreateUpdateShort[],
    setPartners: React.Dispatch<React.SetStateAction<PartnerCreateUpdateShort[]>>,
    onChange: (field: string, value: unknown) => void,
}

const PartnerBlockAdmin = ({ partners, setPartners, onChange }: Props) => {
    const [allPartners, setAllPartners] = useState<Partner[]>([]);
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);

    useEffect(() => {
        Promise.all([
            PartnersStore.getAllPartners()
                .then((parts) => setAllPartners(parts)),
        ]);
    }, []);

    const afterSubmit = (partner: Partner) => {
        const existingPartnerCreateUpdate = partners.find((p) => p.id === partner.id);
        const existingPartner = allPartners.find((p) => p.id === partner.id);
        if (!existingPartnerCreateUpdate) {
            setPartners([...partners, {
                id: partner.id,
                title: partner.title,
                modelState: ModelState.Created,
            }]);
        }
        if (!existingPartner) {
            setAllPartners([...allPartners, partner]);
        }
    };

    const onPartnerSelect = (value: number) => {
        const existingPartner = partners.find((p) => p.id === value);
        const updatedPartners = partners.filter((p) => p.id !== value);

        if (existingPartner) {
            existingPartner.modelState = ModelState.Updated;
            setPartners([...updatedPartners, existingPartner]);
        } else {
            const partner = allPartners.find((c) => c.id === value) as PartnerCreateUpdateShort;
            partner.modelState = ModelState.Created;
            setPartners([...updatedPartners, partner]);
        }

        onChange('partner', value);
    };

    const onPartnerDeselect = (value: number) => {
        const partner = partners.find((x) => x.id === value);
        if (partner?.isPersisted) {
            partner.modelState = ModelState.Deleted;
            setPartners([...partners]);
        } else {
            setPartners(partners.filter((c) => c.id !== value));
        }
        onChange('partner', value);
    };

    const alphabeticalSorting = (partnersItems: PartnerShort[]) => partnersItems.slice()
        .sort((a, b) => a.title.localeCompare(b.title));

    const sortedPartners = alphabeticalSorting(allPartners);

    return (
        <div className="adminContainer-block">
            <h2>Партнери</h2>
            <div className="display-flex-row">
                <SelectWithCustomSuffix
                    mode="multiple"
                    placeholder="Введіть назву партнера"
                    onSelect={onPartnerSelect}
                    value={partners.filter((x) => (x as PartnerCreateUpdateShort).modelState !== ModelState.Deleted)
                        .map((x) => x.id)}
                    filterOption={(input, option) => option?.children?.toLowerCase().indexOf(input.toLowerCase()) !== -1}
                    onDeselect={onPartnerDeselect}
                >
                    {sortedPartners.map((s) => (
                        <Select.Option
                            key={`${s.id}`}
                            value={s.id}
                            disabled={allPartners.find((p) => p.id === s.id)?.isVisibleEverywhere}
                        >
                            {s.title}
                        </Select.Option>
                    ))}
                </SelectWithCustomSuffix>

                <Button
                    className="streetcode-custom-button button-margin-left"
                    onClick={() => setModalAddOpened(true)}
                >
                    Додати
                </Button>
            </div>
            <PartnerModal
                open={modalAddOpened}
                setIsModalOpen={setModalAddOpened}
                isStreetcodeVisible={false}
                afterSubmit={afterSubmit}
            />
        </div>
    );
};
export default PartnerBlockAdmin;
