import './InterestingFactsAdminModal.style.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

import { Button, Form, Modal, Upload } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import FactsApi from '@/app/api/streetcode/text-content/facts.api';
import { Fact } from '@/models/streetcode/text-contents.model';

const InterestingFactsModal = () => {
    const [facts, setFacts] = useState<Fact[]>([]);
    const { modalStore } = useMobx();
    const { setModal, modalsState: { addFacts } } = modalStore;
    const [factTitle, setFactTitle] = useState('');
    const [factContent, setFactContent] = useState('');

    // const handleChange = (event:any) => {
    //     setfactContent(event.target.value);
    // };
    const createFact = (titleValue : string, factContentValue : string) => {
        FactsApi.create({ title: titleValue, factContent: factContentValue }).then((newFact) => {
            setFacts([...facts, newFact]);
        }).catch((e) => console.log(e));
    };

    const onSubmit = (e : any) => {
        e.preventDefault();

        createFact(factTitle, factContent);

        setFactTitle('');
        setFactContent('');
    };
    const characterCount = factContent.length | 0;

      console.log(factTitle);
      console.log(factContent);
    return (
        <Modal
            // title= " Додати Wow-fact"
            className="interestingFactsAdminModal"
            open={addFacts.isOpen}
            onCancel={() => setModal('addFacts')}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <form className="factForm">
                <h2>Wow-Fact</h2>
                <p>Заголовок</p>
                <div className="inputBlock">
                    <input value={factTitle} onChange={(e) => setFactTitle(e.target.value)} />
                    <p>Основний текст</p>
                    <textarea value={factContent} maxLength="600" onChange={(e) => setFactContent(e.target.value)} />
                    <p className="characterCounter">
                        {characterCount}
                        /600
                    </p>
                </div>
                <p>Зображення:</p>
                <FormItem
                    name="picture"
                    className=""
                    rules={[{ required: true, message: 'Завантажте зображення' }]}
                >
                    <Upload
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        //  onPreview={handlePreview}
                    >
                        <div className="upload">
                            <InboxOutlined />
                            <p>Виберіть чи перетягніть файл</p>
                        </div>
                    </Upload>
                </FormItem>
                <Button className="submit" onSubmit={onSubmit}> Додати </Button>
            </form>
        </Modal>
    );
};

export default observer(InterestingFactsModal);
