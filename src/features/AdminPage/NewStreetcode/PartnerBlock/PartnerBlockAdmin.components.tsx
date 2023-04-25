import './PartnerBlockAdmin.style.scss';

import React, { useEffect, useRef, useState } from 'react';
import PartnersStore from '@stores/partners-store';

import { Button, Select } from 'antd';

import PartnerModal from '@/features/AdminPage/PartnersPage/PartnerModal/PartnerModal.component';
import Partner, { PartnerShort } from '@/models/partners/partners.model';

interface Props {
    partners: PartnerShort[];
    setPartners: React.Dispatch<React.SetStateAction<PartnerShort[]>>;
}
const PartnerBlockAdmin = ({ partners, setPartners }: Props) => {

    const [allPartnersShort, setAllPartnerShort] = useState<PartnerShort[]>([]);
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);

    useEffect(() => {
        Promise.all([
            PartnersStore.getAllPartnerShort()
                .then((partners) => setAllPartnerShort(partners))
        ]);

    },[]);

    const onPartnerSelect = (value:number) => {
        const index = allPartnersShort.findIndex((c) => c.id === value);
        //selectedPartners.current.push(allPartnersShort[index]);
        //setPartners(selectedPartners.current);
        setPartners([...partners, allPartnersShort[index]]);
    };
    const onPartnerDeselect = (value:number) => {
        setPartners(partners.filter((c) => c.id !== value));
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
                value={partners.map(x => x.id)}
                onDeselect={onPartnerDeselect}
            >
                {allPartnersShort
                    .map((s) => <Select.Option key={`${s.id}`} value={s.id}>{s.title}</Select.Option>)}
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
