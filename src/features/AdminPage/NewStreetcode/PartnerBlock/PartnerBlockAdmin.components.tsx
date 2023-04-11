import './PartnerBlockAdmin.style.scss';

import React, { useEffect, useRef, useState } from 'react';
import PartnersStore from '@stores/partners-store';

import { Button, Select } from 'antd';

import PartnerModal from '@/features/AdminPage/PartnersPage/PartnerModal/PartnerModal.component';
import { PartnerShort } from '@/models/partners/partners.model';

interface Props {
    onChange: (partner: PartnerShort[]) => void;
}
const PartnerBlockAdmin = ({ onChange }: Props) => {
    const selectedPartners = useRef<PartnerShort[]>([]);
    const [allPartnersShort, setAllPartnerShort] = useState<PartnerShort[]>([]);
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    useEffect(() => {
        Promise.all([
            PartnersStore.getAllPartnerShort()
                .then((partners) => setAllPartnerShort(partners))
                .then(() => console.log(allPartnersShort)),
        ]);
    }, []);

    const onPartnerSelect = (value:string) => {
        const index = allPartnersShort.findIndex((c) => c.title === value);
        selectedPartners.current.push(allPartnersShort[index]);
        onChange(selectedPartners.current);
    };
    const onPartnerDeselect = (value:string) => {
        selectedPartners.current = selectedPartners.current.filter((c) => c.title !== value);
        onChange(selectedPartners.current);
    };
    return (
        <div className="partner-block-admin-container">
            <div className="partner-block-admin-header">
                <p>Партнери</p>
                <Button
                    className="streetcode-custom-button"
                    onClick={() => setModalAddOpened(true)}
                >
                 Додати
                </Button>
            </div>
            <Select
                mode="multiple"
                onSelect={onPartnerSelect}
                onDeselect={onPartnerDeselect}
            >
                {allPartnersShort
                    .map((s) => <Select.Option key={`${s.id}`} value={s.title}>{s.title}</Select.Option>)}
            </Select>
            <PartnerModal
                open={modalAddOpened}
                setIsModalOpen={setModalAddOpened}
                isStreetcodeVisible={false}
                afterSubmit={
                    (partner) => setAllPartnerShort([...allPartnersShort, { id: partner.id, title: partner.title }])
                }
            />
        </div>
    );
};
export default PartnerBlockAdmin;
