import React, { useEffect, useState } from 'react';
import { ModelState } from '@models/enums/model-state';
import PartnersStore from '@stores/partners-store';

import { Button, Select } from 'antd';

import PartnerModal from '@/features/AdminPage/PartnersPage/PartnerModal/PartnerModal.component';
import { PartnerCreateUpdateShort, PartnerShort } from '@/models/partners/partners.model';

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

    const onPartnerSelect = (value:number) => {
        const partnerPersisted = partners.find((x) => x.id === value);
        if (partnerPersisted) { // for case when delete persisted item and add it again
            partnerPersisted.modelState = ModelState.Updated;
            setPartners([...partners]);
        } else {
            const partner = allPartnersShort.find((c) => c.id === value) as PartnerCreateUpdateShort;
            partner.modelState = ModelState.Created;
            setPartners([...partners, partner]);
        }
        onChange('partner', value);
    };

    const onPartnerDeselect = (value:number) => {
        const partner = partners.find((x) => x.id === value);
        if (partner?.isPersisted) {
            partner.modelState = ModelState.Deleted;
            setPartners([...partners]);
        } else {
            setPartners(partners.filter((c) => c.id !== value));
        }
        onChange('partner', value);
    };

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
                >
                    {allPartnersShort.map((s) => <Select.Option key={`${s.id}`} value={s.id}>{s.title}</Select.Option>)}
                </Select>

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
                afterSubmit={
                    (partner) => {
                        setAllPartnerShort([...allPartnersShort, { id: partner.id, title: partner.title }]);
                        setPartners([...partners, { id: partner.id,
                                                    title: partner.title,
                                                    modelState: ModelState.Created }]);
                    }
                }
                onChange={onChange}
            />
        </div>
    );
};
export default PartnerBlockAdmin;
