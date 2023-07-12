import { useState } from 'react';

import { Button } from 'antd';

import TextInputInfo from '@/features/AdminPage/NewStreetcode/TextBlock/InputType/TextInputInfo.model';
import ReadMore from '@/features/StreetcodePage/TextBlock/ReadMore/ReadMore.component';
import { Text } from '@/models/streetcode/text-contents.model';

interface Props {
    inputInfo: Partial<Text> | undefined;
}

const TextPreview = ({ inputInfo } : Props) => {
    const [disabled, setDisabled] = useState(true);

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
                        <ReadMore text={String(inputInfo?.textContent)} />
                    </div>
                </div>
            ) : (
                <div style={{ width: '0' }} />
            ) }
        </div>
    );
};

export default TextPreview;
