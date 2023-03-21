import { Modal, Select, Input } from 'antd';
import React from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  isModalOpen: boolean;
  handleModalCancel: () => void;
  handleFinishEditing: () => void;
  parts: string[];
  onAddPart: (newPart: string) => void;
  categoryName: string;
  setCategoryName: React.Dispatch<React.SetStateAction<string>>;
  selectedPart: string;
  setSelectedPart: React.Dispatch<React.SetStateAction<string>>;
  categoryDescription: string;
  setCategoryDescription: React.Dispatch<React.SetStateAction<string>>;
}

function ForFansModal({
  isModalOpen,
  handleModalCancel,
  handleFinishEditing,
  parts,
  onAddPart,
  categoryName,
  setCategoryName,
  selectedPart,
  setSelectedPart,
  categoryDescription,
  setCategoryDescription,
}: Props) {
  const handleAddPart = (newPart: string) => {
    onAddPart(newPart);
    setSelectedPart(newPart);
  };

  const renderModal = () => {
    return (
      <Modal
        title="Категорія"
        visible={isModalOpen}
        onCancel={handleModalCancel}
        onOk={handleFinishEditing}
      >
        <div>
          <label>Назва категорії:</label>
          <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
        </div>
        <div>
          <label>Частини:</label>
          <Select value={selectedPart} onChange={(value) => setSelectedPart(value)}>
            {parts.map((part) => (
              <Option key={part} value={part}>
                {part}
              </Option>
            ))}
          </Select>
          <Input.Search
            placeholder="Додати нову частину"
            enterButton="Додати"
            onSearch={handleAddPart}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>
        <div>
          <label>Опис:</label>
          <TextArea
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            rows={4}
          />
        </div>
      </Modal>
    );
  }

  return renderModal();
}

export default ForFansModal;
