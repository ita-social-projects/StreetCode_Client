import './TextForm.styles.scss';

import { useEffect } from 'react';

import { Form, FormInstance, Input } from 'antd';

import QUILL_TEXTS_LENGTH from
    '@/features/AdminPage/NewStreetcode/TextBlock/TextLengthConstants/textMaxLength.constant';
import Video from '@/models/media/video.model';
import { Text } from '@/models/streetcode/text-contents.model';

import AdditionalTextBlockAdminForm from './AdditionTextBlock/AdditionalTextBlockAdminForm.component';
import LinkEditor from './Editors/LinkEditor.component';
import TextEditor from './Editors/TextEditor.component';
import TextPreview from './TextPreview/TextPreview.component';
import REQUIRED_FIELD_MESSAGES from '@/app/common/constants/required_field_messages.constrants';

const isQuillEmpty = (text: string | undefined) => {
    return !text || text.replace(/<(.|\n)*?>/g, '').trim().length === 0;
};

interface Props {
    form: FormInstance<unknown>,
    inputInfo: Partial<Text> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<Text> | undefined>>;
    video: Video | undefined;
    setVideo: React.Dispatch<Video | undefined>;
    onChange: (fieldName: string, value: any) => void;
}
const TextForm = ({
    form, inputInfo, setInputInfo, video, setVideo, onChange,
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

    useEffect(() => {
        form.setFieldsValue({
            title: inputInfo?.title,
        });
    }, [inputInfo, form]);

    return (
        <Form.Item className="textForm">
            <Form.Item
                label="Заголовок"
                name="title"
                rules={[{
                    message: REQUIRED_FIELD_MESSAGES.ENTER_HEADER,
                    validator(_, value) {
                        if (!value && !isQuillEmpty(inputInfo?.textContent)) {
                            return Promise.reject(new Error(REQUIRED_FIELD_MESSAGES.ENTER_HEADER));
                        }
                        return Promise.resolve();
                    },
                },
                ]}
            >
                <Input
                    showCount
                    type="text"
                    maxLength={maxTitleLength}
                    onChange={handleChangeTitle}
                />
            </Form.Item>
            <Form.Item>
                <TextEditor
                    character_limit={QUILL_TEXTS_LENGTH.mainTextMaxLength}
                    inputInfo={inputInfo}
                    setInputInfo={setInputInfo}
                    onChange={onChange}
                    text={inputInfo?.textContent}
                />
                <TextPreview inputInfo={inputInfo} />
            </Form.Item>
            <Form.Item>
                <AdditionalTextBlockAdminForm
                    character_limit={QUILL_TEXTS_LENGTH.additionalTextMaxLength}
                    inputInfo={inputInfo}
                    setInputInfo={setInputInfo}
                    onChange={onChange}
                    text={inputInfo?.additionalText}
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
        </Form.Item>
    );
};

export default TextForm;
