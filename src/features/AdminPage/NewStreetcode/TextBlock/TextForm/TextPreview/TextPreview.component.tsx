import './TextPreview.styles.scss';

import React, { useEffect, useState } from 'react';

import { Button } from 'antd';

import TextsApi from '@/app/api/streetcode/text-content/texts.api';
import ReadMore from '@/features/StreetcodePage/TextBlock/ReadMore/ReadMore.component';
import { Text, TextPreviewContent } from '@/models/streetcode/text-contents.model';

interface Props {
    inputInfo: Partial<Text> | undefined;
}

const TextPreview = ({ inputInfo }: Props) => {
    const [disabled, setDisabled] = useState(true);
    const [text, setText] = useState<string>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setText(undefined);
        if (!disabled) {
            setLoading(true);
            const buffer = inputInfo?.textContent?.replaceAll('\n', '').replaceAll('"', '`');
            const content: TextPreviewContent = {
                textContent: buffer ?? '',
            };
            setText(buffer);
            setLoading(false);
        }
    }, [disabled]);

    return (
        <div>
            <Button
                name="previousTextViewBtn"
                disabled={inputInfo === undefined || inputInfo.textContent?.length === 0}
                onClick={() => setDisabled(!disabled)}
                className="streetcode-custom-button"
            >
                Попередній перегляд тексту
            </Button>
            {loading ? (
                <div className="loadingText">
                    <div className="text">
                        Текст завантажується...
                    </div>
                </div>
            ) : (
                inputInfo !== undefined && !disabled && text !== undefined ? (
                    <div className="textComponent">
                        <div className="TextContainer">
                            <ReadMore text={String(text)} />
                        </div>
                    </div>
                ) : (
                    <div style={{ width: '0' }} />
                )
            )}
        </div>
    );
};

export default TextPreview;
