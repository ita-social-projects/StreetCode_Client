import React, { useState } from 'react';
import './ForFans.styles.scss';
import { Card, Col, Row, Button, Input, Space, Modal } from 'antd';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import ForFansModal from './ForFansModal/ForFansModal.component';

interface Item {
  id: string;
  title: string;
  image?: string;
  editing?: boolean;
}

const cardStyle: React.CSSProperties = {
  textAlign: 'center',
};

const ForFansBlock: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 'books', title: 'Книги' },
    { id: 'movies', title: 'Фільми' },
    { id: 'quotes', title: 'Цитати' },
  ]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [itemToEdit, setItemToEdit] = useState<Item | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const itemsCopy = Array.from(items);
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);
    setItems(itemsCopy);
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  const handleAddNewItem = () => {
    if (newItemTitle) {
      const newId = `item${items.length + 1}`;
      const newItems = [
        ...items,
        {
          id: newId,
          title: newItemTitle,
          image: 'https://via.placeholder.com/150x150',
        },
      ];
      setItems(newItems);
      setNewItemTitle('');
    }
  };

  const handleEditItem = (id: string) => {
    const itemToEdit = items.find((item) => item.id === id);
    setItemToEdit({ ...itemToEdit, editing: true });
    setIsModalVisible(true);
  };

  const handleFinishEditing = () => {
    if (itemToEdit) {
      const itemsCopy = items.map((item) =>
        item.id === itemToEdit.id
          ? { ...item, title: itemToEdit.title, image: itemToEdit.image, editing: undefined }
          : item
      );
      setItems(itemsCopy);
      setItemToEdit(undefined);
    }
    setIsModalVisible(false);
  };

  const handleCardClick = (id: string) => {
    const itemToEdit = items.find((item) => item.id === id);
    setItemToEdit(itemToEdit);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setItemToEdit(undefined);
    setIsModalVisible(false);
  };   

  return (
    <div className="for-fans-block">
      <h2 className="for-fans-block__title">Для фанатів</h2>
      <div className="for-fans-block__content">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="items">
            {(provided) => (
              <Row gutter={[16, 16]} {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <Col span={4} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <Card
  key={item.id}
  hoverable
  style={cardStyle}
  cover={<img alt="example" src={item.image} />}
  onClick={() => handleCardClick(item.id)}
  actions={[
    <DeleteOutlined key="delete" onClick={() => handleDeleteItem(item.id)} />,
    <EditOutlined key="edit" onClick={() => handleEditItem(item.id)} />,
  ]}
>
  <Card.Meta title={item.title} />
</Card>
                      </Col>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Row>
            )}
          </Droppable>
          <Modal
            visible={isModalVisible}
            onCancel={handleModalCancel}
            footer={[
              <Button key="cancel" onClick={handleModalCancel}>
                Скасувати
              </Button>,
              <Button key="submit" type="primary" onClick={handleFinishEditing}>
                Зберегти зміни
              </Button>,
            ]}
          >
            <ForFansModal item={itemToEdit} setItem={setItemToEdit} />
          </Modal>
        </DragDropContext>
        <div className="for-fans-block__add-item">
          <Space>
            <Input
              placeholder="Новий елемент"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
            />
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={handleAddNewItem} />
          </Space>
        </div>
      </div>
    </div>
  );
          }  

export default ForFansBlock;

