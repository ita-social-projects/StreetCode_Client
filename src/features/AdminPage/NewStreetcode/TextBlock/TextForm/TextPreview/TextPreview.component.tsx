import { useEffect, useState } from 'react';

import { Button } from 'antd';

import TextsApi from '@/app/api/streetcode/text-content/texts.api';
import ReadMore from '@/features/StreetcodePage/TextBlock/ReadMore/ReadMore.component';
import { Text } from '@/models/streetcode/text-contents.model';

interface Props {
    inputInfo: Partial<Text> | undefined;
}

const TextPreview = ({ inputInfo } : Props) => {
    const [disabled, setDisabled] = useState(true);
    const [text, setText] = useState<string>();

    useEffect(() => {
        if (!disabled) {
            // console.log('Input info: ');
            // console.log(inputInfo?.textContent);
            let buffer = inputInfo?.textContent?.replaceAll('\n', '').replaceAll('"', '`');
            // console.log('Buffer: ');
            // console.log(buffer);
            TextsApi.getParsed(buffer as string).then((x) => {
                buffer = x?.replaceAll('`', '"').toString();
                console.log(buffer);
                setText(buffer);
            }).catch(
                (error) => {
                    console.log(error);
                },
            );
            // console.log('text was fetched');
        }
    }, [disabled]);

    return (
        <div>
            <Button
                disabled={inputInfo === undefined || inputInfo.textContent?.length === 0}
                onClick={() => setDisabled(!disabled)}
                className="streetcode-custom-button"
            >
            Попередній перегляд тексту
            </Button>
            { inputInfo !== undefined && !disabled ? (
                <div className="textComponent">
                    <div className="TextContainer">
                        <ReadMore text={String(text)} />
                    </div>
                </div>
            ) : (
                <div style={{ width: '0' }} />
            ) }
        </div>
    );
};

export default TextPreview;
