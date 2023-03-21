import './ForFansAdminModal.style.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

import { Button, Modal, Upload } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const ForFansModal = () => {
    const { factsStore: { factMap }, modalStore } = useMobx();
    const { setModal, modalsState: { addForFans, facts } } = modalStore;


   // const { setModal, modalsState: { facts } } = modalStore;

    // const factId = facts.fromCardId!;
    // const fact = factMap.get(factId);


    // const factId = 3;
    // const fact = factMap.get(factId);
   // const [title, setTitle] = useState(fact?.title);

    const [message, setMessage] = useState('');
    const handleChange = (event:any) => {
        setMessage(event.target.value);
    };
    
    const handleBoldText = () => {
        const textarea = document.getElementsByTagName('textarea')[0];
        const { selectionStart, selectionEnd } = textarea;
        const selectedText = textarea.value.substring(selectionStart, selectionEnd);
        const boldText = `<b><span style="font-family: 'Times New Roman'; font-size: 18px;">${selectedText}</span></b>`;
        const newText = textarea.value.substring(0, selectionStart) + boldText + textarea.value.substring(selectionEnd);
        setMessage(newText);
      };

  //  console.log(factId);
    return (
        <Modal
            // title= " Додати Wow-fact"
            className="forFansAdminModal"
            open={addForFans.isOpen}
            onCancel={() => setModal('addForFans')}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <form className="factForm">
                <h2>Для фанатів</h2>
                <p>Оберіть категорію</p>
                <div className="inputBlock">
                <select id="category">
            <option value="books">Книги</option>
            <option value="movies">Фільми</option>
            <option value="articles">Статті</option>
          </select>
                    {/* value={fact?.title}
                     //onChange={(e) => setTitle(e.target.value)} */}
                    <p>Основний текст</p>
                    <textarea value={message} onChange={handleChange} />
                </div>
                <Button onClick={handleBoldText}>Розділ</Button>
                <Button className="submit"> Додати </Button>
            </form>
        </Modal>
    );
};

export default observer(ForFansModal);


