import * as React from 'react';
import { Component, useState} from 'react';
import Upload,{ UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';
import ImageNew,  { ImageCreate } from '@/models/media/image.model';
import Audio, { AudioCreate } from '@/models/media/audio.model';

interface Props{
    children: JSX.Element[] | JSX.Element;
    edgeSwipe?: boolean;
    onChange: (uploadParams: UploadChangeParam<UploadFile<any>>) => void;
    uploadTo:'image' | 'audio';
    greyFilterForImage?: boolean;
    onSuccessUpload?:(value: ImageNew | Audio, file?: UploadFile)=>void;
}
 
const FileUploaderMock: React.FC<Props> = ({ onSuccessUpload, uploadTo, greyFilterForImage = false, children, onChange }) => {

  const handleFileChange = (e: UploadChangeParam<UploadFile>) => {
      let file = e.file;
      if(file !== null){
        const newFile: UploadFile = {
            uid: file!.name,
            name: file!.name,
            type: file!.type
        };
        if (onChange) {
            onChange({
                file: newFile,
                fileList: [newFile]
            });
        }
        if(onSuccessUpload){
            onSuccessUpload({
                id: 1,
                base64: 'base64',
                blobName: 'blobname',
                mimeType: 'image/jpeg',
            })
        }
    }
  };

  return (
    <Upload
            onChange={handleFileChange}
            data-testid={"fileuploader"}
        >
            {children}
    </Upload>
  );
}
 
export default FileUploaderMock;