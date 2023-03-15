import { Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useState } from 'react';
import PreviewImageModal from './PreviewImageModal/PreviewImageModal.component';

const DownloadBlock: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
  const [isOpen, setIsOpen] = useState(false);


  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    // const image = new Image();
    // image.src = src;
    // const imgWindow = window.open(src);
    // imgWindow?.document.write(image.outerHTML);
    setFilePreview(file);
    setIsOpen(true);
  };

  return (
    <>
        <Upload
            accept=".jpeg,.png,.jpg"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
        >
            {fileList.length < 15 && '+ Додати'}
        </Upload>
        <PreviewImageModal file={filePreview} opened={isOpen} setOpened={setIsOpen} /> 

    </>
  );
};

export default DownloadBlock;