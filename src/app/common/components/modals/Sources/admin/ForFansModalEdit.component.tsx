import './ForFansAdminModal.style.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

import { Button, Modal, Upload } from 'antd';
import FormItem from 'antd/es/form/FormItem';

const ForFansModal = () => {
    const { factsStore: { factMap }, modalStore } = useMobx();
    const { setModal, modalsState: { editForFans } } = modalStore;


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
    const characterCount = message.length | 0;

  //  console.log(factId);
    return (
        <Modal
            className="forFansAdminModal"
            open={editForFans.isOpen}
            onCancel={() => setModal('editForFans')}
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
                <Button className="submit"> Додати </Button>
            </form>
            </Modal>
    );
}

export default observer(ForFansModal);
