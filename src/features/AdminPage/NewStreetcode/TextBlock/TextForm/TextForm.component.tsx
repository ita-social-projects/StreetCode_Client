import './TextForm.styles.scss';

import { Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import Video from '@/models/media/video.model';
import { Text } from '@/models/streetcode/text-contents.model';

import AdditionalTextBlockAdminForm from './AdditionTextBlock/AdditionalTextBlockAdminForm.component';
import LinkEditor from './Editors/LinkEditor.component';
import TextEditor from './Editors/TextEditor.component';
import TextPreview from './TextPreview/TextPreview.component';

interface Props {
    inputInfo: Partial<Text> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<Text> | undefined>>;
    video: Video | undefined;
    setVideo: React.Dispatch<Video | undefined>;
    onChange: (fieldName: string, value: any) => void;
}
const TextForm = ({
    inputInfo, setInputInfo, video, setVideo, onChange,
}: Props) => {
    const maxTitleLength = 50;
    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setInputInfo((prevInputInfo) => ({
            ...prevInputInfo,
            title: value,
        }));
        onChange('title', value);
    };
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
                <TextEditor
                    character_limit={15000}
                    inputInfo={inputInfo}
                    setInputInfo={setInputInfo}
                    onChange={onChange}
                />
                <TextPreview inputInfo={inputInfo} />
            </Form.Item>
            <Form.Item>
                <AdditionalTextBlockAdminForm
                    character_limit={200}
                    inputInfo={inputInfo}
                    setInputInfo={setInputInfo}
                    onChange={onChange}
                />
            </Form.Item>
            <Form.Item>
                <LinkEditor
                    inputInfo={inputInfo}
                    setInputInfo={setInputInfo}
                    video={video}
                    setVideo={setVideo}
                    onChange={onChange}
                />
            </Form.Item>
        </FormItem>
    );
};

export default TextForm;
