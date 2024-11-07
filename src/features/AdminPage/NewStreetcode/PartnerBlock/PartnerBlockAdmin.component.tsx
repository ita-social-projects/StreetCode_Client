import React, { useEffect, useState } from 'react';
import { ModelState } from '@models/enums/model-state';
import PartnersStore from '@stores/partners-store';

import { Button, Select } from 'antd';

import PartnerModal from '@/features/AdminPage/PartnersPage/PartnerModal/PartnerModal.component';
import Partner, { PartnerCreateUpdateShort, PartnerShort } from '@/models/partners/partners.model';

interface Props {
    partners: PartnerCreateUpdateShort[],
    setPartners: React.Dispatch<React.SetStateAction<PartnerCreateUpdateShort[]>>,
    onChange: (field: string, value: any) => void,
}

const PartnerBlockAdmin = ({ partners, setPartners, onChange }: Props) => {
    const [allPartnersShort, setAllPartnerShort] = useState<PartnerShort[]>([]);
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);

    useEffect(() => {
        Promise.all([
            PartnersStore.getAllPartnerShort()
                .then((parts) => setAllPartnerShort(parts)),
        ]);
    }, []);

    const afterSubmit = (partner: Partner) => {
        console.log(partner);
        const existingPartner = partners.find((p) => p.id === partner.id);
        const existingPartnerShort = allPartnersShort.find((p) => p.id === partner.id);
        if (!existingPartner) {
            setPartners([...partners, {
                id: partner.id,
                title: partner.title,
                modelState: ModelState.Created,
            }]);
        }
        if (!existingPartnerShort) {
            setAllPartnerShort([...allPartnersShort, { id: partner.id, title: partner.title }]);
        }
    };

    const onPartnerSelect = (value: number) => {
        const existingPartner = partners.find((p) => p.id === value);
        const updatedPartners = partners.filter((p) => p.id !== value);

        if (existingPartner) {
            existingPartner.modelState = ModelState.Updated;
            setPartners([...updatedPartners, existingPartner]);
        } else {
            const partner = allPartnersShort.find((c) => c.id === value) as PartnerCreateUpdateShort;
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

    const sortedPartners = alphabeticalSorting(allPartnersShort);

    return (
        <div className="adminContainer-block">
            <h2>Партнери</h2>
            <div className="display-flex-row">
                <Select
                    mode="multiple"
                    onSelect={onPartnerSelect}
                    value={partners.filter((x) => (x as PartnerCreateUpdateShort).modelState !== ModelState.Deleted)
                        .map((x) => x.id)}
                    onDeselect={onPartnerDeselect}
                    data-testid="partnersCombobox"
                >
                    {sortedPartners.map((s) => <Select.Option key={`${s.id}`} value={s.id}>{s.title}</Select.Option>)}
                </Select>

                <Button
                    name="addPartnerBtn"
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
