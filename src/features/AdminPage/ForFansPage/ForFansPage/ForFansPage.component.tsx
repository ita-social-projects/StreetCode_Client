import SourcesComponent from "@/features/StreetcodePage/SourcesBlock/Sources.component";
import React, { useState } from 'react';
import { Card, Col, Row, Button, Input, Space, Modal } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'; 
import { observer } from 'mobx-react-lite';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useRouteId from "@hooks/stateful/useRouter.hook";
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import { SourceCategory } from '@models/sources/sources.model';

interface Props {
  srcCategory: SourceCategory;
}

const SourceItem = ({ srcCategory }: Props) => {
    const { sourcesStore } = useMobx();
    const { deleteSrcCategoryById} = sourcesStore;
    const { modalStore: { setModal } } = useMobx();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState(srcCategory.title);
    const [imageUrl, setImageUrl] = useState(srcCategory.image?.url.href);
  
    const handleDelete = (event: React.MouseEvent) => {
      event.stopPropagation();
      deleteSrcCategoryById(srcCategory.id);
    };
  
    const handleEdit = (event: React.MouseEvent) => {
      event.stopPropagation();
      setIsModalVisible(true);
    };
  
    const handleOk = () => {
      // Perform validation and update source category
      setIsModalVisible(false);
    };
  
    const handleCancel = () => {
      setTitle(srcCategory.title);
      setImageUrl(srcCategory.image?.url.href);
      setIsModalVisible(false);
    };
  
    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    };
  
    const handleChangeImageUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
      setImageUrl(event.target.value);
    };
  
    return (
        <div
          className="sourcesSliderItem"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <h1>{title}</h1>
          <div className="sourceActions">
            <Button icon={<EditOutlined />} onClick={handleEdit} />
            <Button icon={<DeleteOutlined />} onClick={handleDelete} />
          </div>
          <Modal
            title="Edit Source Category"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Space direction="vertical" size="middle">
              <Input placeholder="Title" value={title} onChange={handleChangeTitle} />
              <Input placeholder="Image URL" value={imageUrl} onChange={handleChangeImageUrl} />
            </Space>
          </Modal>
        </div>
      );
    };


    const ForFansPage = () => {
        const { sourcesStore } = useMobx();
        const { fetchSrcCategoriesByStreetcodeId, srcCategoriesMap } = sourcesStore;
        const streetcodeId = useRouteId();
      
        useAsync(
          () => fetchSrcCategoriesByStreetcodeId(streetcodeId),
          [streetcodeId],
        );
      
        const getSrcCategoriesArray = () => {
          return Array.from(srcCategoriesMap.values());
        };

        const [isAddModalVisible, setIsAddModalVisible] = useState(false);
const [newTitle, setNewTitle] = useState('');
const [newImageUrl, setNewImageUrl] = useState('');

const handleAdd = () => {
setIsAddModalVisible(true);
};

const handleAddOk = () => {
// Perform validation and add new source category
setIsAddModalVisible(false);
};

const handleAddCancel = () => {
setNewTitle('');
setNewImageUrl('');
setIsAddModalVisible(false);
};

const handleChangeNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
setNewTitle(event.target.value);
};

const handleChangeNewImageUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
setNewImageUrl(event.target.value);
};

const handleDeleteAll = () => {
// Perform confirmation and delete all source categories
};

const handleSaveOrder = (srcCategories: SourceCategory[]) => {
// Update order of source categories
};

return (
    <div className="forFansPage">
      <BlockHeading title="For Fans" />
      <BlockSlider>
        {getSrcCategoriesArray(streetcodeId)?.map((srcCategory) => (
          <Col span={6}>
            <Card bordered={false}>
              <SourceItem srcCategory={srcCategory} />
            </Card>
          </Col>
        ))}
      </BlockSlider>
      <Button
  type="dashed"
  icon={<PlusOutlined />}
  style={{ marginTop: 16 }}
  onClick={handleAdd}
>
  Add New Source Category
</Button>
      <Modal
         title="Add New Source Category"
         visible={isAddModalVisible}
         onOk={handleAddOk}
         onCancel={handleAddCancel}
       >
<Space direction="vertical" size="middle">
<Input placeholder="Title" value={newTitle} onChange={handleChangeNewTitle} />
<Input placeholder="Image URL" value={newImageUrl} onChange={handleChangeNewImageUrl} />
</Space>
</Modal>
    </div>
  );
};

export default observer(ForFansPage);