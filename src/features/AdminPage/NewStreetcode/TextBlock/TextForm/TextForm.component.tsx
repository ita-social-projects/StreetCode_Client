import './TextForm.styles.scss';

import { useEffect, useState } from 'react';
import TextInputInfo from '@features/AdminPage/NewStreetcode/TextBlock/InputType/TextInputInfo.model';

import { Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import Video from '../../../../../models/media/video.model';

import AdditionalTextBlockAdminFormComponent from './AdditionTextBlock/AdditionalTextBlockAdminForm.component';
import LinkEditor from './Editors/LinkEditor.component';
import TextEditor from './Editors/TextEditor.component';
import TextPreview from './TextPreview/TextPreview.component';

interface Props {
    inputInfo: Partial<TextInputInfo> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<TextInputInfo> | undefined>>;
    video: Video | undefined;
    setVideo: React.Dispatch<Video | undefined>;
}
const TextForm = ({ inputInfo, setInputInfo, video, setVideo }: Props) => {
    const maxTitleLength = 50;
    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputInfo({ ...inputInfo, title: e.target.value });
    };
    useEffect(() => {

    });
    return (
        <FormItem className="textForm">
            <Form.Item
                label="Заголовок"
            >
                <Input
                    showCount
                    value={inputInfo?.title}
                    name="title"
                    type="text"
                    maxLength={maxTitleLength}
                    onChange={handleChangeTitle}
                />
            </Form.Item>
            <Form.Item>
                <TextEditor inputInfo={inputInfo} setInputInfo={setInputInfo} />
                <TextPreview inputInfo={inputInfo} />
            </Form.Item>
            <Form.Item>
                <AdditionalTextBlockAdminFormComponent />
            </Form.Item>
            <Form.Item>
                <LinkEditor inputInfo={inputInfo} setInputInfo={setInputInfo} video={video} setVideo={setVideo} />
            </Form.Item>
        </FormItem>
    );
};

export default TextForm;
